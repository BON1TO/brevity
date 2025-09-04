# 📝 Brevity

Brevity is a full-stack web app that summarizes PDFs and text using AI (Hugging Face models).  
It has two parts:
- **Backend** (`brevityb/`): FastAPI service for PDF/text extraction and summarization.
- **Frontend** (`brevityf/`): React (Vite) app that provides a simple UI for uploading documents and getting summaries.

---

## 🚀 Features
- Upload PDF (text-based for now) → get concise AI-powered summaries.
- Adjustable word count (50–250).
- REST API endpoints (`/upload`, `/summarize-text`, `/health`) with Swagger docs.
- Frontend built with React + Vite, backend with FastAPI.

---

## 📂 Project Structure
brevity/
├── brevityb/ # Backend (FastAPI)
│ ├── main.py # API entrypoint
│ ├── services.py # PDF/text extraction + Hugging Face summarization
│ └── requirements.txt
├── brevityf/ # Frontend (React + Vite)
│ ├── package.json
│ ├── vite.config.js
│ └── src/
├── .gitignore
└── README.md

## ⚙️ Backend (FastAPI)

### Local Setup

```bash

cd brevityb
python -m venv venv
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt

Environment Variables
Create brevityb/.env:

Copy code :

HF_API_KEY=your_huggingface_api_key
HF_MODEL=facebook/bart-large-cnn
💻 Frontend (React + Vite)
Local Setup
bash

Copy code:

cd brevityf
npm install
npm run dev

API Base URL
Create brevityf/.env:


Copy code :

🌐 Deployment (Render)
Backend (Web Service)
Root Directory: brevityb

Build Command:

bash
Copy code
pip install -r requirements.txt
Start Command:

bash
Copy code
uvicorn main:app --host 0.0.0.0 --port $PORT
Add env vars in Render Dashboard:

HF_API_KEY : "your key goes here"

HF_MODEL : "your key goes here"

Frontend (Static Site)
Root Directory: brevityf

Build Command:

npm ci && npm run build
Publish Directory: dist

📌 TODO / Future Plans
 Support OCR for scanned PDFs (Tesseract + Poppler).

 Background jobs for long summaries.

 Improve UI for summary preview & history.

