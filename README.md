# 🤖 RAG Chatbot - Hỏi Đáp Tiếng Việt Dựa Trên Tài Liệu Người Dùng

Ứng dụng này sử dụng kiến trúc RAG (Retrieval-Augmented Generation) để trả lời các câu hỏi tiếng Việt dựa trên tài liệu người dùng tải lên. Sử dụng mô hình LLM và hệ thống vector Qdrant cho việc tìm kiếm ngữ nghĩa.

## 🏗 Cấu trúc hệ thống

- **Frontend**: React (không bao gồm trong repo này)
- **Backend**: FastAPI
- **Vector Store**: Qdrant (chạy local hoặc cloud)
- **Embedding model**: `bkai-foundation-models/vietnamese-bi-encoder`
- **LLM model**: `google/flan-t5-large` (hoặc thay thế bằng mô hình nhẹ hơn)

---
## Hướng dẫn chạy 

---

###Frontend 
cd frontend   
npm install  
npm run dev   
App sẽ chạy trên localhost:5173  

---

### Backend 
chạy Qdrant trên docker desktop: docker run -p 6333:6333 qdrant/qdrant  
chạy backend : uvicorn app.main:app --reload  
