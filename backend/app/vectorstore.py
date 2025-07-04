from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance
from langchain_experimental.text_splitter import SemanticChunker
from qdrant_client.models import Filter, FieldCondition, MatchValue
from langchain.text_splitter import RecursiveCharacterTextSplitter


import os

# === Embedding model ===
embedding_model = HuggingFaceEmbeddings(model_name="bkai-foundation-models/vietnamese-bi-encoder")

# === Qdrant setup ===
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "chatbot"

if not QDRANT_API_KEY:
    raise ValueError("QDRANT_API_KEY is not set. Check your .env file or environment variables.")

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

if COLLECTION_NAME not in [c.name for c in client.get_collections().collections]:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    )

# === LangChain VectorStore ===
vectorstore = QdrantVectorStore.from_existing_collection(
    embedding=embedding_model,
    collection_name=COLLECTION_NAME,
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)


# === Chunking ===
text_splitter = SemanticChunker(
    embeddings=embedding_model,
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=85,
    min_chunk_size=100,
)

# === Thêm tài liệu ===
# def insert_document(user_id: str, text: str):
#     docs = text_splitter.create_documents([text], metadatas=[{"user_id": user_id}])
#     vectorstore.add_documents(docs)

def insert_document(user_id: str, text: str, metadata_extra: dict = None):
    """
    Thêm tài liệu của một người dùng vào vectorstore.
    Có xử lý lỗi SemanticChunker và fallback nếu cần.
    """
    # 1. Tiền xử lý
    clean_text = preprocess_text(text)
    base_metadata = {"user_id": user_id}

    # Cho phép thêm metadata tùy chọn (title, topic,...)
    if metadata_extra:
        base_metadata.update(metadata_extra)

    # 2. Chunking
    try:
        docs = text_splitter.create_documents(
            [clean_text],
            metadatas=[base_metadata]
        )
        print(f"[SemanticChunker] Chunking thành công với {len(docs)} đoạn.")

    except Exception as e:
        print(f"[Fallback] SemanticChunker lỗi: {e}")
        fallback_splitter = RecursiveCharacterTextSplitter(
            chunk_size=512,
            chunk_overlap=64,
            separators=["\n\n", "\n", ".", " "]
        )
        docs = fallback_splitter.create_documents(
            [clean_text],
            metadatas=[base_metadata]
        )
        print(f"[Fallback] Dùng RecursiveCharacterTextSplitter: {len(docs)} đoạn.")

    # 3. Thêm vào vectorstore
    vectorstore.add_documents(docs)
    print(f"[✅] Đã thêm tài liệu của user {user_id} vào vectorstore.")

def preprocess_text(text: str) -> str:
    """
    Làm sạch văn bản thô trước khi chunking.
    """
    text = text.replace("•", "\n-")       # Chuyển bullet points thành dòng mới
    text = text.replace("\t", " ")        # Loại bỏ tab
    text = text.replace("  ", " ")        # Xoá khoảng trắng thừa
    text = text.replace(":\n", ": ")      # Dòng mới sau dấu ':' gây lỗi chunk
    text = text.replace("\n\n", "\n")     # Loại bỏ nhiều dòng trống liên tiếp
    text = text.strip()
    return text

def get_retriever(user_id: str):
    metadata_filter = Filter(
        must=[
            FieldCondition(
                 key="metadata.user_id", 
                match=MatchValue(value=user_id)
            )
        ]
    )

    return vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 5,
            "filter": metadata_filter
        }
    )

def retrieve(user_id: str, query: str, top_k=5):
    metadata_filter = Filter(
        must=[
            FieldCondition(
                 key="metadata.user_id", 
                match=MatchValue(value=user_id)
            )
        ]
    )

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": top_k, "filter": metadata_filter}
    )

    return retriever.get_relevant_documents(query)
