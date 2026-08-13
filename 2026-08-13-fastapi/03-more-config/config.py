from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    port: int = 9000

def get_settings() -> Settings:
    return Settings()


"""
add a config value for app name
add a get endpoint to the app /name that echoes the app name
http://localhost:9000/name should show {"app_name":"{whatever you config as app name}"}
"""