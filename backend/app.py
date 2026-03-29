import os
import requests
import base64
import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# ================= ENV =================
load_dotenv()

AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_KEY = os.getenv("AZURE_KEY")
GPT_MODEL = os.getenv("GPT_MODEL")

app = Flask(__name__)
CORS(app)

# ================= HELPERS =================
def clean_title(title):
    if not title:
        return "My Story"

    title = title.strip()

    # Remove prefixes
    title = re.sub(r'^(Title|title|TITLE|शीर्षक)\s*[:\-–]\s*', '', title)

    # Remove numbering
    title = re.sub(r'^\d+[\.\-\)]\s*', '', title)

    # Remove symbols/markdown
    title = re.sub(r'(^[*_~`#"\s]+|[*_~`#"\s]+$)', '', title)

    return title.strip() or "My Story"


def parse_story(content):
    lines = [line.strip() for line in content.split("\n") if line.strip()]

    if not lines:
        return "My Story", ""

    if len(lines) == 1:
        return "My Story", lines[0]

    first = lines[0].lower()

    if first.startswith("title") or first.startswith("शीर्षक"):
        title = clean_title(lines[0])
        story = " ".join(lines[1:])
    else:
        title = clean_title(lines[0])
        story = " ".join(lines[1:])

    return title, story


def call_api(body):
    try:
        response = requests.post(
            f"{AZURE_ENDPOINT}/chat/completions",
            headers={
                "Authorization": f"Bearer {AZURE_KEY}",
                "Content-Type": "application/json"
            },
            json=body,
            timeout=15
        )

        if response.status_code != 200:
            print("API ERROR:", response.text)
            return None

        return response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        print("REQUEST ERROR:", e)
        return None


def format_names(names, language):
    if not names:
        return "a child" if language == "english" else "एक बच्चा"

    if len(names) == 1:
        return names[0]

    if language == "english":
        return ", ".join(names[:-1]) + " and " + names[-1]
    else:
        return ", ".join(names[:-1]) + " और " + names[-1]


# ================= ROUTES =================

@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    try:
        data = request.get_json()

        names = data.get("names", [])
        age = data.get("ageGroup", "")
        theme = data.get("theme", "")
        language = data.get("language", "english").lower()

        child_names = format_names(names, language)

        # Prompt
        if language == "hindi":
            system = "You write Hindi children's stories."
            prompt = f"{child_names} को मुख्य पात्र बनाकर {theme} विषय पर कहानी लिखें। "
        else:
            system = "You write children's stories."
            prompt = f"Write a {theme} story with {child_names} as main characters. "

        if age == "3–5":
            prompt += "Use very simple words."
        elif age == "6–8":
            prompt += "Make it fun and magical."
        elif age == "9–12":
            prompt += "Add imagination and adventure."

        body = {
            "model": GPT_MODEL,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.9
        }

        content = call_api(body)

        if not content:
            return jsonify({"title": "", "story": ""}), 500

        title, story = parse_story(content)

        return jsonify({"title": title, "story": story})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"title": "", "story": ""}), 500


@app.route('/api/generate-from-photo', methods=['POST'])
def generate_from_photo():
    try:
        photo = request.files['photo']
        theme = request.form.get("theme", "Children")
        names = request.form.getlist("names[]")
        age = request.form.get("ageGroup", "3–5")
        language = request.form.get("language", "english").lower()

        child_names = format_names(names, language)

        # Save temp image
        os.makedirs("temp", exist_ok=True)
        path = os.path.join("temp", secure_filename(photo.filename))
        photo.save(path)

        with open(path, "rb") as f:
            image_base64 = base64.b64encode(f.read()).decode()

        # Prompt
        if language == "hindi":
            prompt = f"इस चित्र के आधार पर {child_names} के साथ {theme} कहानी लिखें। पहले शीर्षक दें।"
            system = "You write Hindi children's stories."
        else:
            prompt = f"Write a {theme} children's story based on this image with {child_names}. Start with title."
            system = "You write children's stories."

        body = {
            "model": GPT_MODEL,
            "messages": [
                {"role": "system", "content": system},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{photo.mimetype};base64,{image_base64}"
                            }
                        }
                    ]
                }
            ]
        }

        content = call_api(body)

        # Delete temp file
        os.remove(path)

        if not content:
            return jsonify({"title": "", "story": ""}), 500

        title, story = parse_story(content)

        return jsonify({
            "title": title,
            "story": story,
            "language": language,
            "ageGroup": age
        })

    except Exception as e:
        print("IMAGE ERROR:", e)
        return jsonify({"title": "", "story": ""}), 500


@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    try:
        data = request.get_json()
        story = data.get("story")

        if not story:
            return jsonify({"error": "No story"}), 400

        prompt = f"""
Generate 3 MCQs from the story.
Return JSON list.

Story:
{story}
"""

        body = {
            "model": GPT_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        content = call_api(body)

        try:
            quiz = json.loads(content)
        except:
            match = re.search(r'\[\s*{.*}\s*\]', content, re.DOTALL)
            if match:
                quiz = json.loads(match.group(0))
            else:
                return jsonify({"error": "Invalid format"}), 500

        return jsonify({"quiz": quiz})

    except Exception as e:
        print("QUIZ ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True)