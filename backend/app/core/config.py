from pydantic_settings import BaseSettings
from pydantic import validator
from typing import Optional, Any

class Settings(BaseSettings):
    PROJECT_NAME: str = "T2 Training Management"
    API_V1_STR: str = "/api/v1"
    
    # Environment-specific settings read from .env file
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URL: Optional[str] = None # Changed type hint

    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        
        # Ensure values are present before attempting to build the URL
        if not all(k in values for k in ["POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_SERVER", "POSTGRES_DB"]):
            raise ValueError("Database connection components are missing for URL assembly")

        # Build the connection string manually
        return (
            f"postgresql+psycopg://{values['POSTGRES_USER']}:{values['POSTGRES_PASSWORD']}"
            f"@{values['POSTGRES_SERVER']}/{values['POSTGRES_DB']}"
        )

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    class Config:
        case_sensitive = True
        env_file = ".env" # This tells pydantic to load the .env file

settings = Settings()
