from app.rag_chain import build_rag_chain
from app.vectorstore import retrieve

def generate_answer(user_id: str, question: str) -> dict:
    try:
        print(f"📩 Received question from user {user_id}: {question}")

        # === Tạo chain tương ứng user ===
        rag_chain = build_rag_chain(user_id)

        # === Gọi RAG pipeline ===
        answer = rag_chain.invoke(question)

        # === Trích xuất lại tài liệu cho phần sources ===
        docs = retrieve(user_id, question)
        print(f"✅ Retrieved {len(docs)} documents for user {user_id}")
        sources = [doc.page_content for doc in docs]

        return {
            "answer": answer.strip(),
            "sources": sources
        }

    except Exception as e:
        print("❌ Error in generate_answer:", str(e))
        return {
            "answer": "Đã xảy ra lỗi khi sinh câu trả lời.",
            "sources": []
        }
