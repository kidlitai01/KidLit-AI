# 📚 KidLit AI

KidLit AI is an interactive storybook and picture book generator for children, built with **React** (frontend) and **Flask** (backend).  
It creates fun, personalized stories for kids using AI, with support for **text-to-speech**, **quizzes**, **multilingual (English/Hindi)** features, and optional image personalization.

---

## ✨ Features

- 🎨 **Two Modes**
  - **Storybook**: Generate a story with child’s **name**, **theme**, and **age group**.
    - 📷 Optionally **upload an image** — for personalization in the story display.
  - **Picture Book**: Prewritten themed stories with images, personalized using the child’s name.

- 📖 **Dynamic Storytelling**
  - AI-generated stories with engaging plots.
  - Simple, age-appropriate language (3–5, 6–8, etc.).
  - Automatic story title generation.

- 🖼️ **Picture Book Flow**
  - Stories organized in folders by **theme + age group**.
  - Each page alternates **image + text** in a kid-friendly format.
  - Supports **name replacement** and **Hindi/English translation**.

- 🔊 **Voice Narration**
  - Text-to-Speech (TTS) with **word-by-word highlighting**.
  - Resume from the last stopped word.

- 🤖 **Robot Guide**
  - Robot character narrates stories.
  - Speech bubble shows text being read in sync.

- 📝 **Quizzes from Stories**
  - Auto-generated fun questions based on the story.
  - Interactive learning after reading.

- 📱 **Mobile Friendly**
  - Responsive UI design for phones and tablets.
  - Child-friendly pink theme with playful icons and illustrations.

---



## ⚙️ Tech Stack

- **Frontend**: React, TailwindCSS, Framer Motion  
- **Backend**: Flask (Python)  
- **AI Model**: GitHub-hosted GPT-4.1 via `https://models.github.ai/inference`  
- **Speech**: Web Speech API (TTS with boundary highlighting)  
- **Storage**: Prewritten picturebooks stored in `static/picturebooks`  

---



## 📜 License

MIT License © 2025 KidLit AI
