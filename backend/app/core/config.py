from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SunoGov API"
    API_V1_STR: str = "/api"
    
    # Server configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # CORS Origins (Restricted for security, no wildcard '*' in production/development settings)
    # Can be a list in code, or a comma-separated string in environment variables
    BACKEND_CORS_ORIGINS: List[str] | str = [
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174"
    ]

    @property
    def get_cors_origins(self) -> List[str]:
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",") if o.strip()]
        return self.BACKEND_CORS_ORIGINS
    
    # AI configuration settings
    AI_PROVIDER: str = "mock"
    OPENROUTER_API_KEY: str | None = None
    OPENROUTER_MODEL: str = "z-ai/glm-5.3-flash"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    AI_CONFIDENCE_THRESHOLD: float = 0.50
    
    # Bhashini / AI4Bharat voice settings
    BHASHINI_API_KEY: str | None = None
    BHASHINI_USER_ID: str | None = None
    BHASHINI_APP_ID: str | None = None
    BHASHINI_BASE_URL: str = "https://dhruva.ai4bharat.org"

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
