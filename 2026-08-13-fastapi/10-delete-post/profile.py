from uuid import UUID

import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from config import get_settings
from database import get_db
from models import Comment, Post, User

router = APIRouter(prefix="/profile")
settings = get_settings()
security = HTTPBearer(auto_error=False)


def get_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    if credentials is None:
        raise HTTPException(status_code=401, detail="auth header is missing!")

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.secret,
            algorithms=["HS256"],
        )
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="invalid token")

    return payload["id"]


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "profile_pic": user.profile_pic,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


def serialize_comment(comment: Comment) -> dict:
    return {
        "id": comment.id,
        "post_id": comment.post_id,
        "user": serialize_user(comment.user),
        "body": comment.body,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
    }


@router.get("")
def get_profile(
    user_id: str = Depends(get_user_id),
    db: Session = Depends(get_db),
):
    posts = db.scalars(
        select(Post)
        .where(Post.user_id == user_id)
        .options(
            selectinload(Post.user),
            selectinload(Post.comments).selectinload(Comment.user),
        )
        .order_by(Post.created_at.desc())
    ).all()

    return [
        {
            "id": post.id,
            "user": serialize_user(post.user),
            "title": post.title,
            "body": post.body,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "comments": [serialize_comment(comment) for comment in post.comments],
        }
        for post in posts
    ]


@router.delete("/{post_id}")
def delete_post(
    post_id: UUID,
    user_id: str = Depends(get_user_id),
    db: Session = Depends(get_db),
):
    post = db.scalar(
        select(Post).where(Post.id == str(post_id), Post.user_id == user_id)
    )
    if not post:
        raise HTTPException(status_code=404, detail="post not found")

    db.delete(post)
    db.commit()

    return {"detail": "post deleted"}
