# 📚 KidLit AI

An AI-powered children's storytelling platform that generates personalized Storybooks and Picture Books for young readers. KidLit AI combines Artificial Intelligence, interactive storytelling, voice narration, quizzes, and multilingual support to create an engaging reading experience for children.

---

## 🌟 Overview

KidLit AI is a web-based application developed using React and Flask that allows children and parents to create personalized stories based on selected themes, age groups, and character names.

The platform offers two unique experiences:

### 📖 Storybook Mode

Generate original AI-powered stories using:

* Child's name
* Theme selection
* Age group selection
* Optional image upload for personalization

### 🖼️ Picture Book Mode

Read illustrated pre-written stories organized by:

* Theme
* Age group
* Language (English/Hindi)

Stories are automatically personalized with the child's name to create a unique reading experience.

---

## ✨ Key Features

### 📖 AI Story Generation

* Personalized stories based on user inputs
* Theme-based storytelling
* Age-appropriate content generation
* Dynamic story title creation
* Multi-character story support

### 🖼️ Interactive Picture Books

* Pre-written illustrated stories
* Theme and age-group categorization
* Dynamic character name replacement
* Hindi and English language support
* Random story selection for variety

### 🔊 Smart Voice Narration

* Text-to-Speech (TTS) support
* Word-by-word highlighting
* Auto page progression during narration
* Resume reading from the last stopped position
* Hindi and English voice support

### 🤖 Virtual Story Guide

* Friendly robot narrator
* Interactive speech bubble
* Synchronized narration display
* Child-friendly visual experience

### 📝 Story-Based Quiz Generation

* Automatic quiz creation from generated stories
* Interactive learning experience
* Reading comprehension enhancement

### 🌐 Multilingual Support

* English stories
* Hindi stories
* Language-specific narration support

### 📱 Responsive Design

* Mobile-friendly interface
* Tablet support
* Desktop compatibility
* Child-focused colorful UI

### 📄 Export Features

* Story PDF generation
* Picture Book PDF export

---

## 🏗️ System Architecture

### Frontend

* React.js
* React Router
* Framer Motion
* CSS3

### Backend

* Flask
* Flask-CORS
* REST APIs

### AI Integration

* GPT-4.1
* GitHub Models API

### Additional Technologies

* Web Speech API
* PDF Export Utilities
* Dynamic Story Rendering

---

## 🎯 Supported Age Groups

| Age Group  | Story Style                               |
| ---------- | ----------------------------------------- |
| 3–5 Years  | Simple vocabulary and short stories       |
| 6–8 Years  | Moderate storytelling and adventure       |
| 9–12 Years | Detailed narratives and richer vocabulary |

---

## 🎨 Available Themes

* Adventure
* Fantasy
* Sci-Fi
* Mystery
* Fairytale
* Educational
* Funny
* Action
* Magic

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd KidLit-AI
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

#### Windows

```bash
venv\Scripts\activate
```

#### Mac/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
AZURE_ENDPOINT=https://models.github.ai/inference
AZURE_KEY=YOUR_GITHUB_TOKEN
GPT_MODEL=openai/gpt-4.1
```

Run the Flask server:

```bash
python app.py
```

Backend will start on:

```text
http://localhost:5000
```

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

Frontend will start on:

```text
http://localhost:3000
```

---

### 4. Open the Application

Visit:

```text
http://localhost:3000
```

You can now:

* Generate AI Storybooks
* Read Picture Books
* Listen to Narration
* Attempt Quizzes
* Export Stories as PDF

---

## 🌐 Deployment

### Frontend

* Vercel

### Backend

* Render

### AI Service

* GitHub Models API (GPT-4.1)

---

## 📊 Major Functional Modules

### Storybook Module

1. Enter child details
2. Select theme and age group
3. Generate AI story
4. Read with voice narration
5. Attempt generated quiz
6. Export as PDF

### Picture Book Module

1. Enter child details
2. Select theme and age group
3. Choose language
4. Load personalized story
5. View illustrations
6. Export as PDF

---

## 👥 Team Contribution

The project was developed collaboratively as part of an academic project. Team members contributed to:

* Requirement analysis
* Story design
* Frontend development
* Backend implementation
* API integration
* Testing and debugging
* Documentation preparation

---

## 📜 License

MIT License © 2026 KidLit AI

---

## ❤️ Project Goal

KidLit AI aims to encourage reading habits among children through personalized storytelling, interactive narration, engaging visuals, and educational quizzes while making learning fun, creative, and accessible.
