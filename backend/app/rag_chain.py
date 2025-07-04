# app/rag_chain.py

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.prompts import PromptTemplate
from app.llm_pipeline import llm
from app.vectorstore import get_retriever

# === Prompt cho LLM ===
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
Bạn là một trợ lý AI hiểu tiếng Việt, có nhiệm vụ trả lời câu hỏi dựa trên thông tin được cung cấp bên dưới.

### Ngữ cảnh:
{context}

### Câu hỏi:
{question}

### Trả lời một cách chính xác và súc tích, sử dụng ngôn ngữ tự nhiên:
"""
)

# === Format context ===
def format_docs(docs):
    context = "\n\n".join(doc.page_content for doc in docs)[:4000]
    print("🧾 Formatted Context:\n", context)
    return context

# === Hàm build RAG chain động theo user ===
def build_rag_chain(user_id: str):
    retriever = get_retriever(user_id)
    
    return (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
