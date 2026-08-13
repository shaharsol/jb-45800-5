from fastapi import Depends, FastAPI
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import get_settings
from database import Base, engine, get_db
from models import User, Comment

app = FastAPI()
settings = get_settings()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def homepage():
    return {"page": "home"}


@app.get("/name")
def name():
    return {"name": settings.app_name}


@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.scalars(select(User)).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "profile_pic": user.profile_pic,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }
        for user in users
    ]

@app.get("/comments")
def list_comments(db: Session = Depends(get_db)):
    comments = db.scalars(select(Comment)).all()
    return [
        {
            "id": comment.id,
            "user_id": comment.user_id,
            "body": comment.body
        }
        for comment in comments
    ]


print(f"starting server on port {settings.port}")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        port=settings.port,
        reload=True
    )
