from fastapi import FastAPI
from config import get_settings

# const app = express()
app = FastAPI()
settings = get_settings()


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def homepage():
    return {"page": "home"}

@app.get("/name")
def name():
    return {"name": settings.app_name}

print(f"starting server on port {settings.port}")
# app.get("/", health)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        port=settings.port,
        reload=True
    )
