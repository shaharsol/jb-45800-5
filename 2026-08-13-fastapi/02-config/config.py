from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    port: int = 9000

def get_settings() -> Settings:
    return Settings()