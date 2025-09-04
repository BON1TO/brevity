# main.py
import asyncio
import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel

# Keep using your text-only extractor and summarizer
from services import extract_text_from_pdf, summarize_long_text

app = FastAPI(title="Brevity API", version="1.0.0")

# DEV: allow all origins. IN PROD, change to the exact frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://brevity-1.onrender.com"],  # e.g. ["https://your-frontend.onrender.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = 25 * 1024 * 1024  # 25 MB limit, adjust as needed

class SummarizePayload(BaseModel):
    text: str
    wordCount: int = 150

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/summarize-text")
def summarize_text(payload: SummarizePayload):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Empty text.")
    summary = summarize_long_text(payload.text, payload.wordCount)
    return {"summary": summary}

# helper: run blocking functions in a threadpool so FastAPI stays responsive
async def run_blocking(func, *args, **kwargs):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, lambda: func(*args, **kwargs))

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    """
    Debug endpoint — returns the raw extracted text preview and char count.
    Useful to check PDF extraction separately from summarization.
    """
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file.")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large.")

    # run PyPDF2 extraction in threadpool (blocking)
    try:
        text = await run_blocking(extract_text_from_pdf, io.BytesIO(raw))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")

    if not text or not text.strip():
        raise HTTPException(status_code=422, detail="No extractable text found.")
    return {"chars": len(text), "preview": text[:2000]}

@app.post("/upload")
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...), wordCount: int = Form(150)):
    """
    Upload a PDF + desired wordCount and return the summary.
    Extraction and summarization run in a threadpool to avoid blocking the server.
    """
    # Basic guards
    if file.content_type and "pdf" not in file.content_type and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are accepted.")
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file.")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 25MB).")

    # 1) Extract text (blocking) in a worker thread
    try:
        text = await run_blocking(extract_text_from_pdf, io.BytesIO(raw))
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Extraction failed", "detail": str(e)})

    if not text or not text.strip():
        return JSONResponse(status_code=422, content={"error": "No extractable text found (is it a scanned image-only PDF?)."})

    # 2) Summarize (blocking HF calls) in a worker thread
    try:
        summary = await run_blocking(summarize_long_text, text, wordCount)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Summarization failed", "detail": str(e)})

    return {"summary": summary}
