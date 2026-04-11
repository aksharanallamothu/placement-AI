from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import PyPDF2
import io

app = FastAPI()

# ✅ Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Store resume text globally
resume_text = ""

# ---------------------------------------
# 📄 Upload Resume API
# ---------------------------------------
@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    global resume_text

    contents = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))

    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""

    resume_text = text

    print("Extracted text length:", len(resume_text))

    return {"message": "Resume processed successfully"}


# ---------------------------------------
# 💬 Chat API (Ollama)
# ---------------------------------------
@app.post("/chat")
async def chat(data: dict):
    user_input = data.get("message", "")

    if not resume_text:
        return {"response": "⚠️ Please upload your resume first."}

    # ✅ Trim resume (VERY IMPORTANT for speed)
    trimmed_resume = resume_text[:1500]

    # ✅ Clean structured prompt
    prompt = f"""
You are a professional career assistant.

Give clear, structured, and well-formatted answers using:
- Headings
- Bullet points
- Short paragraphs

Resume:
{trimmed_resume}

User Question:
{user_input}
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3:8b",   # ⚡ fast model
                "prompt": prompt,
                "stream": False
            }
        )

        result = response.json()
        answer = result.get("response", "No response")

        return {"response": answer}

    except Exception as e:
        print("Error:", e)
        return {"response": "❌ Error connecting to AI model"}