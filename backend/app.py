import os
import requests
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
import re
import json
import random

load_dotenv()

AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_KEY = os.getenv("AZURE_KEY")
GPT_MODEL = os.getenv("GPT_MODEL")

app = Flask(__name__)
CORS(app)

@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    try:
        data = request.get_json()
        names = data.get("names", [])  # list of names
        age_group = data.get("ageGroup", "")
        theme = data.get("theme", "")
        language = data.get("language", "english").lower()

        # Handle names gracefully
        if not names:
            child_names = "a child"
        elif len(names) == 1:
            child_names = names[0]
        else:
            child_names = ", ".join(names[:-1]) + " and " + names[-1]

        # Build prompt
        if language == "hindi":
            system_prompt = "You are a helpful assistant who writes beautiful children's stories in Hindi."
            prompt = f"एक {theme} विषय पर बच्चों की कहानी लिखें। मुख्य पात्र: {child_names}। "
        else:
            system_prompt = "You are a helpful story-writing assistant for children."
            prompt = f"Write a {theme} story for children. The main character(s) are {child_names}. "

        if age_group == "3–5":
            prompt += "Use very simple words and short sentences. The story should be fun, easy to understand, and engaging for a child aged 3 to 5."
        elif age_group == "6–8":
            prompt += "Make it fun, magical, and suitable for children aged 6 to 8 with a light adventure."
        elif age_group == "9–12":
            prompt += "Include imaginative elements, humor or suspense for ages 9 to 12."

        # API request
        body = {
            "model": GPT_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.9,
            "top_p": 1
        }

        headers = {
            "Authorization": f"Bearer {AZURE_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(f"{AZURE_ENDPOINT}/chat/completions", headers=headers, json=body)

        if response.status_code != 200:
            print("Error:", response.status_code, response.text)
            return jsonify({"title": "", "story": ""}), 500

        content = response.json()["choices"][0]["message"]["content"]
        lines = content.strip().split('\n')
        title = re.sub(r'^[^a-zA-Z0-9\u0900-\u097F]+|[^a-zA-Z0-9\u0900-\u097F]+$', '', lines[0].strip())
        story = " ".join(lines[1:]).strip()

        return jsonify({"title": title, "story": story})

    except Exception as e:
        print("Error:", e)
        return jsonify({"title": "", "story": ""}), 500


@app.route('/api/generate-from-photo', methods=['POST'])
def generate_from_photo():
    try:
        photo = request.files['photo']
        theme = request.form.get("theme", "Children").strip()
        names = request.form.getlist("names[]")
        ageGroup = request.form.get("ageGroup", "").strip() or "3–5"
        language = request.form.get("language", "english").strip().lower()

        # Handle names gracefully
        if not names:
            child_names = "a child" if language == "english" else "एक बच्चा"
        elif len(names) == 1:
            child_names = names[0]
        else:
            if language == "english":
                child_names = ", ".join(names[:-1]) + " and " + names[-1]
            else:
                child_names = " और ".join([", ".join(names[:-1]), names[-1]])

        # Save photo temporarily
        filename = secure_filename(photo.filename)
        filepath = os.path.join("temp", filename)
        os.makedirs("temp", exist_ok=True)
        photo.save(filepath)

        with open(filepath, "rb") as f:
            image_base64 = base64.b64encode(f.read()).decode()

        mimetype = photo.mimetype or "image/jpeg"

        # Build prompt
        if language == "hindi":
            prompt = f"इस चित्र के आधार पर एक {theme} विषय पर बच्चों की कहानी हिंदी में लिखें। "
            prompt += f"मुख्य पात्र: {child_names}। "
            if ageGroup == "3–5":
                prompt += "3 से 5 वर्ष के बच्चों के लिए बहुत सरल शब्दों और छोटे वाक्यों का उपयोग करें। "
            elif ageGroup == "6–8":
                prompt += "6 से 8 वर्ष के बच्चों के लिए मजेदार और जादुई कहानी बनाएं। "
            elif ageGroup == "9–12":
                prompt += "9 से 12 वर्ष के बच्चों के लिए कल्पनाशीलता और थोड़ा रोमांच जोड़ें। "
            prompt += "कृपया पहले एक रचनात्मक शीर्षक दें, फिर कहानी लिखें।"
            system_prompt = "You are a helpful assistant that writes beautiful children's stories in Hindi."
        else:
            prompt = f"Write a children's story based on the image in a {theme} theme. "
            prompt += f"The main character(s) are {child_names}. "
            if ageGroup == "3–5":
                prompt += "Use very simple words and short sentences for 3–5 year olds. "
            elif ageGroup == "6–8":
                prompt += "Make it fun, magical, and suitable for 6–8 year olds. "
            elif ageGroup == "9–12":
                prompt += "Include imagination and a bit of suspense for 9–12 year olds. "
            prompt += "Start with a creative title on the first line, then write the story."
            system_prompt = "You are a helpful story-writing assistant for children."

        # API request
        body = {
            "model": GPT_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:{mimetype};base64,{image_base64}"}}
                    ]
                }
            ],
            "temperature": 0.9,
            "top_p": 1
        }

        headers = {
            "Authorization": f"Bearer {AZURE_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(f"{AZURE_ENDPOINT}/chat/completions", headers=headers, json=body)

        if response.status_code != 200:
            print("Image Error:", response.status_code, response.text)
            return jsonify({"title": "", "story": "Could not generate story from image."}), 500

        content = response.json()["choices"][0]["message"]["content"]
        lines = content.strip().split('\n')

        # Title = first line
        title = re.sub(r'(^[*_~`#"\s]+|[*_~`#"\s]+$)', '', lines[0].strip())

        # Story = remaining lines as a single string
        story_lines = [line.strip() for line in lines[1:] if line.strip()]
        story = " ".join(story_lines)

        # Ensure string format for frontend
        return jsonify({
            "title": title,
            "story": story,        # ✅ story as a string
            "language": language,
            "ageGroup": ageGroup
        })

    except Exception as e:
        print("Image Generation Error:", e)
        return jsonify({"title": "", "story": "Image processing failed."}), 500




@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    story_text = data.get('story')

    if not story_text:
        return jsonify({'error': 'No story text provided'}), 400

    prompt = f"""
Based on the following children's story, generate 3 multiple-choice questions.
Each question should have:
- a "question" field,
- an "options" array with 4 choices,
- and an "answer" field with the correct answer (must match one of the options).

Respond in valid JSON format as a list of objects.

Story:
\"\"\"{story_text}\"\"\"
"""

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AZURE_KEY}"
    }

    body = {
        "model": GPT_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        response = requests.post(f"{AZURE_ENDPOINT}/chat/completions", headers=headers, json=body)
        response.raise_for_status()

        result = response.json()
        content = result["choices"][0]["message"]["content"]

        import json
        try:
            quiz_data = json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r'\[.*?\]', content, re.DOTALL)
            if match:
                quiz_data = json.loads(match.group(0))
            else:
                return jsonify({'error': 'Could not parse quiz JSON', 'raw': content}), 500

        return jsonify({'quiz': quiz_data})

    except Exception as e:
        print("Quiz Generation Error:", e)
        return jsonify({'error': str(e)}), 500
    


    

if __name__ == '__main__':
    app.run(debug=True)
