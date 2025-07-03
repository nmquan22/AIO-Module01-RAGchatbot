from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.rag_logic import insert_document, retrieve
from app.llm_logic import generate_answer
import os, fitz, io
from starlette.concurrency import run_in_threadpool

load_dotenv()
ENV = os.getenv("ENV", "dev")

app = FastAPI(title="RAG Chatbot API", version="1.0")
origins = ["http://localhost:5173"] if ENV == "dev" else ["https://your-production-frontend.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_doc(user_id: str = Form(...), file: UploadFile = Form(...)):
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(await file.read())
    else:
        text = (await file.read()).decode("utf-8")
    insert_document(user_id, text)
    return {"msg": "Uploaded & embedded"}

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=io.BytesIO(pdf_bytes), filetype="pdf")
    return "".join(page.get_text() for page in doc)

@app.post("/query")
async def ask(user_id: str = Form(...), query: str = Form(...)):
    return {"context": [doc.page_content for doc in retrieve(user_id, query)]}

@app.post("/ask")
async def ask_answer(user_id: str = Form(...), query: str = Form(...)):
    return await run_in_threadpool(generate_answer, user_id, query)
