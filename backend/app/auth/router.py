from fastapi import APIRouter, HTTPException, Depends
from passlib.hash import bcrypt
from app.auth.user_model import UserIn, UserOut, Token
from app.auth.jwt import create_access_token
from app.db import get_user_collection

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserIn):
    users = get_user_collection()
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hash(user.password)
    result = users.insert_one({"email": user.email, "password": hashed})
    return {"id": str(result.inserted_id), "email": user.email}

@router.post("/login", response_model=Token)
def login(user: UserIn):
    users = get_user_collection()
    db_user = users.find_one({"email": user.email})
    if not db_user or not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token}
