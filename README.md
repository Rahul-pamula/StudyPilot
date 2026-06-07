<div align="center">

# ✈️ StudyPilot

**Study Faster. Stress Less.**  
*An AI-powered educational workspace designed to help students optimize their learning experience without the overwhelm.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org/)

</div>

---

<div align="center">
  <img src="docs/screenshots/landing-hero.png" alt="StudyPilot Hero" width="800"/>
  <br/><br/>
  <img src="docs/screenshots/landing-features.png" alt="StudyPilot Features" width="800"/>
  <br/><br/>
  <img src="docs/screenshots/landing-benefits.png" alt="StudyPilot Benefits" width="800"/>
  <br/><br/>
  <img src="docs/screenshots/signin.png" alt="StudyPilot Sign In" width="800"/>
</div>

---

## 🌟 Why StudyPilot?

StudyPilot combines a **technical chatbot**, a **multi-format notes summarizer**, and a **stress-adaptive study planner** into a single, beautifully crafted premium interface. 

It operates seamlessly in both **online** (via the Groq API) and **offline** modes (falling back to local ML models), ensuring you can study anywhere, anytime.

---

## ✨ Key Features

### 💬 Ask Anything (Technical Chatbot)
<div align="center"><img src="docs/screenshots/chat.png" alt="Chat UI" width="700"/></div>

A chatbot helper tailored to Python, Data Structures & Algorithms (DSA), OOP, and Machine Learning.
* **Smart Mode (Online):** Powered by the **Groq API** (`llama-3.3-70b-versatile`) to generate structured, markdown-rich answers with syntax-highlighted code blocks, lists, and tips.
* **Offline Fallback:** Employs a local **TF-IDF + Cosine Similarity** model mapped against a pre-loaded knowledge base of 100+ common questions.
* **Sentiment Analysis:** Monitors your emotional state using **NLTK's VADER Sentiment Analyzer**, giving supportive real-time micro-feedback if you appear stressed.

### 📝 Notes Summarizer
<div align="center"><img src="docs/screenshots/summarizer.png" alt="Summarizer UI" width="700"/></div>

Turn long lecture slides, messy notes, or documents into structured clarity.
* **Word Customization:** Easily control the output length (between 10 to 1000 words).
* **Multiple Output Formats:** Formats summaries into *Plain Text*, *Bullet Points*, *Essay*, *Letter*, or *Email*.
* **Local Fallback:** Uses Hugging Face's local transformer pipeline (`transformers` with `t5-small`) to generate summary chunks offline.

### 📅 Adaptive Study Planner
<div align="center"><img src="docs/screenshots/planner.png" alt="Planner UI" width="700"/></div>

A Pomodoro-style interactive study schedule that adapts dynamically to your mental state.
* **Mood Check-in:** Processes how you are feeling (e.g., *stressed*, *tired*, *excited*) before generating the plan.
* **Stress-Adaptive Breaks:**
  * 🧘 **Gentle Mode (High Stress):** 20 min focus + 10 min recovery breaks.
  * 🍃 **Mellow Mode (Mild Stress):** 25 min focus + 10 min breaks.
  * 🚀 **Classic Mode (Healthy/Motivated):** 25 min focus + 5 min breaks.
* **Motivational Engine:** Delivers dynamic, mood-tailored quotes to push you through tough study sessions.

---

## 🛠️ Technology Stack

| Architecture Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend UI** | [Next.js 15](https://nextjs.org/), [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion, Lucide Icons |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/), Uvicorn, Python-Jose (JWT) |
| **Database** | [SQLite](https://www.sqlite.org/) |
| **AI LLM Engine** | [Groq API](https://groq.com/) (`llama-3.3-70b-versatile`) |
| **NLP & Local ML** | `nltk`, `scikit-learn`, `transformers` (T5-small), PyTorch |

---

## 🚀 Getting Started

You can run StudyPilot using Docker (recommended for the easiest experience) or natively on your machine.

<details>
<summary><b>🐳 Method 1: Docker Setup (Recommended)</b></summary>

<br/>

*See [Docker Notes](docs/Docker_Notes.md) for full architectural documentation.*

1. Ensure **Docker Desktop** is installed and running.
2. Clone the repository and configure your environment:
   ```bash
   git clone https://github.com/Rahul-pamula/StudyPilot.git
   cd StudyPilot
   ```
3. Add your `.env` file inside the `backend/` directory (see Manual Setup below for variables).
4. Build and start the containers:
   ```bash
   docker compose up --build -d
   ```
5. Access the app at `http://localhost:3000` and API docs at `http://localhost:8000/docs`.

</details>

<details>
<summary><b>💻 Method 2: Manual Local Setup</b></summary>

<br/>

**Prerequisites:** Node.js v18+ and Python 3.10+

**1. Setup the FastAPI Backend**
```bash
git clone https://github.com/Rahul-pamula/StudyPilot.git
cd StudyPilot/backend

# Create virtual environment and install deps
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your credentials
# GROQ_API_KEY=your_key_here
# GMAIL_ADDRESS=your_email@gmail.com
# GMAIL_APP_PASSWORD=your_app_password

# Start the API
uvicorn src.api.main:app --reload --port 8000
```

**2. Setup the Next.js Frontend**
In a new terminal window:
```bash
cd StudyPilot/frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

</details>

---

<div align="center">
  <p><i>Made for real students, not perfect ones.</i></p>
  <p><b>StudyPilot © 2025</b></p>
</div>
