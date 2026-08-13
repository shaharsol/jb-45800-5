import hashlib
import hmac
import uuid
from datetime import datetime

import jwt
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from models import User

router = APIRouter(prefix="/auth")
settings = get_settings()


class LoginRequest(BaseModel):
    username: str = Field(min_length=6, pattern=r"^[a-zA-Z0-9]+$")
    password: str = Field(min_length=6)


class SignupRequest(LoginRequest):
    name: str


def hash_password(plain_text_password: str) -> str:
    return hmac.new(
        settings.secret.encode(),
        plain_text_password.encode(),
        hashlib.sha256,
    ).hexdigest()


def create_jwt(user: User) -> str:
    payload = {
        "id": user.id,
        "username": user.username,
        "name": user.name,
    }
    return jwt.encode(payload, settings.secret, algorithm="HS256")


@router.post("/signup")
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.username == body.username))
    if existing:
        raise HTTPException(status_code=400, detail="username already taken")

    now = datetime.now()
    user = User(
        id=str(uuid.uuid4()),
        name=body.name,
        username=body.username,
        password=hash_password(body.password),
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"jwt": create_jwt(user)}


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(
        select(User).where(
            User.username == body.username,
            User.password == hash_password(body.password),
        )
    )
    if not user:
        raise HTTPException(status_code=401, detail="wrong credentials")

    return {"jwt": create_jwt(user)}
