import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from models import Post

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


@router.get("")
def get_profile(
    user_id: str = Depends(get_user_id),
    db: Session = Depends(get_db),
):
    posts = db.scalars(
        select(Post)
        .where(Post.user_id == user_id)
        .order_by(Post.created_at.desc())
    ).all()

    return [
        {
            "id": post.id,
            "user_id": post.user_id,
            "title": post.title,
            "body": post.body,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
        }
        for post in posts
    ]
