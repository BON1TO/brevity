# main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from services import extract_text_from_pdf, summarize_long_text

app = FastAPI(title="Brevity API", version="1.0.0")

# CORS: during dev, allow all. In prod, restrict to your frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g. ["https://brevity.onrender.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizePayload(BaseModel):
    text: str
    wordCount: int = 150

# --- Root + Health -----------------------------------------------------------

@app.get("/", include_in_schema=False)
def root():
    # Friendly landing: open Swagger UI
    return RedirectResponse(url="/docs")

@app.get("/health")
def health():
    return {"status": "ok"}

# --- Summarization -----------------------------------------------------------

@app.post("/summarize-text")
def summarize_text(payload: SummarizePayload):
    """
    Send raw text + desired wordCount. Useful for testing without PDFs.
    """
    summary = summarize_long_text(payload.text, payload.wordCount)
    return {"summary": summary}

# Accept both /upload and /upload/ to avoid trailing-slash 404s
@app.post("/upload")
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...), wordCount: int = Form(150)):
    """
    Upload a PDF + desired wordCount (50/100/150/200/250).
    Returns: { summary: "..." }
    """
    # 1) Extract
    text = extract_text_from_pdf(file.file)

    # 2) Summarize
    summary = summarize_long_text(text, wordCount)

    return {"summary": summary}
