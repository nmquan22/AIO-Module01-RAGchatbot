from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["rag_chatbot"]

def get_user_collection():
    return db["users"]

def get_other_collection():  # ví dụ sau dùng cho metadata
    return db["others"]
