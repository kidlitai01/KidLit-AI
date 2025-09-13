from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os, json, random

app = Flask(__name__, static_folder="static")
CORS(app)

# Set this in Render dashboard environment variables
BACKEND_URL = os.environ.get("BACKEND_URL", "")  # e.g., https://kidlit-picturebook-backend.onrender.com

def find_image(folder_path, filename_without_ext):
    """
    Returns a full URL for frontend to fetch images.
    """
    for ext in [".png", ".jpg", ".jpeg", ".webp"]:
        candidate = os.path.join(folder_path, filename_without_ext + ext)
        if os.path.isfile(candidate):
            rel_path = os.path.relpath(candidate, app.static_folder).replace(os.sep, "/")
            return f"{BACKEND_URL}/static/{rel_path}" if BACKEND_URL else f"/static/{rel_path}"
    return None

@app.route("/api/story/<gender>/<theme>/<age_group>")
def get_random_story(gender, theme, age_group):
    """
    Returns a random story JSON from the requested gender/theme/age_group.
    """
    name = request.args.get("name", "").strip()

    # Normalize folder names (lowercase, replace en-dash with normal dash)
    gender = gender.lower()
    theme = theme.lower()
    age_group = age_group.replace("–", "-")  # replace en-dash

    base_path = os.path.join(
        app.static_folder,
        gender,
        "picturebooks",
        theme,
        age_group
    )

    print(f"[DEBUG] Searching stories in: {base_path}")

    if not os.path.exists(base_path):
        return jsonify({"error": f"No stories available for {gender}/{theme}/{age_group}."}), 404

    stories = []
    for story_folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, story_folder)
        if not os.path.isdir(folder_path):
            continue

        # Look for JSON story file
        possible_jsons = [
            os.path.join(folder_path, f"{story_folder}.json"),
            os.path.join(folder_path, "story.json"),
        ]
        story_file = next((p for p in possible_jsons if os.path.isfile(p)), None)
        if not story_file:
            continue

        try:
            with open(story_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Replace <name> placeholders
            if name:
                data["title"] = data.get("title", "").replace("<name>", name)
                for page in data.get("pages", []):
                    if "text" in page:
                        page["text"] = page["text"].replace("<name>", name)

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
            print(f"[ERROR] Loading {story_file}: {e}")

    if not stories:
        return jsonify({"error": "No valid stories found."}), 404

    selected_story = random.choice(stories)
    return jsonify(selected_story)

# Serve static files
@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# Root endpoint
@app.route("/")
def index():
    return jsonify({"message": "KidLit Picturebook Backend running!"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
