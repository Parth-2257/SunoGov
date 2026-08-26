from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SunoGov API"
    API_V1_STR: str = "/api"
    
    # Server configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # CORS Origins (Allow all for hackathon prototyping, can be restricted later)
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Future integrations (Optional in Phase 0)
    OPENAI_API_KEY: str | None = None
    MONGODB_URI: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )


settings = Settings()
