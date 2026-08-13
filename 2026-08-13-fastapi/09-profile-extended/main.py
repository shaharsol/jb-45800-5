from fastapi import FastAPI

from auth import router as auth_router
from config import get_settings
from database import Base, engine
from profile import router as profile_router

app = FastAPI()
settings = get_settings()

app.include_router(auth_router)
app.include_router(profile_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    
    print(f"starting server on port {settings.port}")

    uvicorn.run(
        "main:app",
        port=settings.port,
        reload=True
    )
