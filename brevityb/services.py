# services.py
import os
import re
import time
import requests
from typing import List
from PyPDF2 import PdfReader
from dotenv import load_dotenv

# --- Load environment variables ---
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY", "")
HF_MODEL = os.getenv("HF_MODEL", "facebook/bart-large-cnn")
HF_ENDPOINT = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

# Approx. English tokens per word (for Hugging Face length params)
TOKENS_PER_WORD = 1.5


# -------------------- PDF Extraction -------------------- #

def extract_text_from_pdf(upload_file) -> str:
    """
    Read all pages from a PDF UploadFile-like object and return plain text.
    Safely skips corrupt pages.
    """
    reader = PdfReader(upload_file)
    text_parts = []
    for i, page in enumerate(reader.pages, start=1):
        try:
            t = page.extract_text() or ""
            text_parts.append(t)
        except Exception as e:
            print(f"[WARN] Failed to extract page {i}: {e}")
            continue
    text = "\n".join(text_parts)
    return clean_text(text)


def clean_text(text: str) -> str:
    """
    Normalize whitespace and strip weird artifacts.
    """
    # Replace multiple spaces/newlines with single
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    return text.strip()


# -------------------- Chunking -------------------- #

def chunk_text_by_words(text: str, words_per_chunk: int = 800) -> List[str]:
    """
    Split a long string into word-based chunks to fit model limits.
    """
    words = text.split()
    chunks = []
    for i in range(0, len(words), words_per_chunk):
        chunk_words = words[i: i + words_per_chunk]
        chunks.append(" ".join(chunk_words))
    return chunks


# -------------------- Hugging Face API -------------------- #

def call_hf_api(payload: dict, retries: int = 3, backoff: float = 5.0) -> dict:
    """
    Call Hugging Face Inference API with retry logic for cold starts & rate limits.
    """
    if not HF_API_KEY:
        return {"error": "HF_API_KEY not set on server."}

    headers = {"Authorization": f"Bearer {HF_API_KEY}"}

    for attempt in range(1, retries + 1):
        try:
            resp = requests.post(HF_ENDPOINT, headers=headers, json=payload, timeout=120)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code in (429, 503):
                # Rate limited or model loading → wait and retry
                print(f"[INFO] HF retry {attempt}/{retries} after {resp.status_code}")
                time.sleep(backoff * attempt)
                continue
            # Other errors → return immediately
            return {"error": f"[HF error {resp.status_code}] {resp.text}"}
        except requests.RequestException as e:
            print(f"[WARN] HF request exception on attempt {attempt}: {e}")
            time.sleep(backoff * attempt)

    return {"error": "HF API failed after retries."}


def summarize_chunk_hf(text: str, target_words: int) -> str:
    """
    Summarize one text chunk using HF Inference API.
    """
    max_tokens = int(target_words * TOKENS_PER_WORD)
    min_tokens = max(20, int(target_words * 0.6 * TOKENS_PER_WORD))

    payload = {
        "inputs": text,
        "parameters": {
            "max_length": max_tokens,
            "min_length": min_tokens,
            "do_sample": False,
        },
        "options": {"wait_for_model": True},
    }

    data = call_hf_api(payload)

    if isinstance(data, list) and data and "summary_text" in data[0]:
        return data[0]["summary_text"]
    if isinstance(data, dict) and "generated_text" in data:
        return data["generated_text"]
    if "error" in data:
        return data["error"]
    return str(data)


# -------------------- High-level Summarization -------------------- #

def summarize_long_text(text: str, target_words: int) -> str:
    """
    Chunk -> summarize each -> combine -> (optional) second-pass compress.
    """
    if not text.strip():
        return "No extractable text found in the document."

    # 1) chunk the source text
    chunks = chunk_text_by_words(text, words_per_chunk=800)

    # 2) summarize each chunk to a smaller target (e.g., 1/3 of requested)
    per_chunk_words = max(60, int(target_words / max(1, len(chunks)) * 1.3))
    partials = [summarize_chunk_hf(c, per_chunk_words) for c in chunks]

    joined = " ".join(partials)

    # 3) optional second-pass "summary of summaries" to hit the target precisely
    if len(chunks) > 1:
        return summarize_chunk_hf(joined, target_words)
    return joined
