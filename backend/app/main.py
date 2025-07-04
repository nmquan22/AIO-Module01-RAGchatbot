from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.rag_logic import insert_document, retrieve
from app.llm_logic import generate_answer
import os, fitz, io
from starlette.concurrency import run_in_threadpool
from app.auth.router import router as auth_router
from fastapi import Depends, HTTPException
from app.auth.jwt import oauth2_scheme, decode_access_token

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

app.include_router(auth_router, prefix="/auth")

@app.post("/upload")
async def upload_doc(
    file: UploadFile = Form(...),
    token: str = Depends(oauth2_scheme)
):
    user_email = decode_access_token(token)
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(await file.read())
    else:
        text = (await file.read()).decode("utf-8")
    insert_document(user_email, text)
    return {"msg": "Uploaded & embedded"}

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=io.BytesIO(pdf_bytes), filetype="pdf")
    return "".join(page.get_text() for page in doc)

@app.post("/query")
async def ask(
    query: str = Form(...),
    token: str = Depends(oauth2_scheme)
):
    user_email = decode_access_token(token)
    return {"context": [doc.page_content for doc in retrieve(user_email, query)]}

@app.post("/ask")
async def ask_answer(
    query: str = Form(...),
    token: str = Depends(oauth2_scheme)
):
    user_email = decode_access_token(token)
    return await run_in_threadpool(generate_answer, user_email, query)