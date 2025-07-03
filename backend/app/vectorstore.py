from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance
from langchain_experimental.text_splitter import SemanticChunker
from qdrant_client.models import Filter, FieldCondition, MatchValue


import os

# === Embedding model ===
embedding_model = HuggingFaceEmbeddings(model_name="bkai-foundation-models/vietnamese-bi-encoder")

# === Qdrant setup ===
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "chatbot"

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
def insert_document(user_id: str, text: str):
    docs = text_splitter.create_documents([text], metadatas=[{"user_id": user_id}])
    vectorstore.add_documents(docs)

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
