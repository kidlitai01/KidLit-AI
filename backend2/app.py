from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os, json, random

# For name transliteration
from indic_transliteration.sanscript import transliterate, ITRANS, DEVANAGARI

app = Flask(__name__, static_folder="static")
CORS(app)

BACKEND_URL = os.environ.get("BACKEND_URL", "") 

def find_image(folder_path, filename_without_ext):
    for ext in [".png", ".jpg", ".jpeg", ".webp"]:
        candidate = os.path.join(folder_path, filename_without_ext + ext)
        if os.path.isfile(candidate):
            rel_path = os.path.relpath(candidate, app.static_folder).replace(os.sep, "/")
            return f"{BACKEND_URL}/static/{rel_path}" if BACKEND_URL else f"/static/{rel_path}"
    return None

def convert_name_to_hindi(name: str) -> str:
    try:
        return transliterate(name, ITRANS, DEVANAGARI)
    except Exception:
        return name  # fallback to original if something goes wrong

@app.route("/api/story/<gender>/<theme>/<age_group>")
def get_random_story(gender, theme, age_group):
    """
    gender: 'boy' or 'girl'
    theme: selected theme
    age_group: 3-5, 6-8, 9-12
    name: query param
    language: 'english' or 'hindi' (optional)
    """
    name = request.args.get("name", "").strip()
    language = request.args.get("language", "").lower().strip()
    base_path = os.path.join(app.static_folder, gender, "picturebooks", theme, age_group)

    if not os.path.exists(base_path):
        return jsonify({"error": f"No stories available for {gender}/{theme}/{age_group}."}), 404

    stories = []
    for story_folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, story_folder)
        if not os.path.isdir(folder_path):
            continue

        # Select story file based on language
        possible_jsons = []
        if language == "hindi":
            possible_jsons.append(os.path.join(folder_path, "hindi.json"))
        else:
            possible_jsons.extend([
                os.path.join(folder_path, f"{story_folder}.json"),
                os.path.join(folder_path, "story.json"),
            ])

        story_file = next((p for p in possible_jsons if os.path.isfile(p)), None)
        if not story_file:
            continue

        try:
            with open(story_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Replace <name> placeholders
            if name:
                name_to_use = convert_name_to_hindi(name) if language == "hindi" else name
                data["title"] = data.get("title", "").replace("<name>", name_to_use)
                for page in data.get("pages", []):
                    if "text" in page:
                        page["text"] = page["text"].replace("<name>", name_to_use)

            # Remove cover image if exists
            if "cover" in data:
                data.pop("cover", None)

            # Fix page image paths
            for i, page in enumerate(data.get("pages", [])):
                if "image" in page and page["image"]:
                    img_base = os.path.splitext(os.path.basename(page["image"]))[0]
                    data["pages"][i]["image"] = find_image(folder_path, img_base)

            stories.append(data)

        except Exception as e:
            print(f"Error loading {story_file}: {e}")

    if not stories:
        return jsonify({"error": "No valid stories found."}), 404

    selected_story = random.choice(stories)
    return jsonify(selected_story)


# Serve static files
@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)


if __name__ == "__main__":
    app.run(port=5001, debug=True)
