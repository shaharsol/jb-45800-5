from pydantic_settings import BaseSettings, SettingsConfigDict, YamlConfigSettingsSource

class Settings(BaseSettings):
    port: int = 9000
    app_name: str = "betterpy"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        yaml_file="config.yaml",
        yaml_file_encoding="utf-8",
        extra="ignore"
    )

    @classmethod
    def settings_customise_sources(cls, settings_cls, init_settings, env_settings, dotenv_settings, file_secret_settings):
        return (
            init_settings,
            env_settings,
            YamlConfigSettingsSource(settings_cls)
        )


def get_settings() -> Settings:
    return Settings()


"""
add a config value for app name
add a get endpoint to the app /name that echoes the app name
http://localhost:9000/name should show {"app_name":"{whatever you config as app name}"}
"""