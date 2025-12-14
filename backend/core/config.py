from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import (computed_field)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local")
    )

    MONGODB_SERVER : str
    MONGODB_PORT : int
    MONGODB_DB : str
    
    SECRET_KEY : str
    ALGORITHM : str
    ACCESS_TOKEN_EXPIRE_MINUTES : int

    API_URL : str

    @computed_field
    @property
    def MONGODB_URI(self) -> str:
        return f"mongodb://{self.MONGODB_SERVER}:{self.MONGODB_PORT}"
    
settings = Settings() # type: ignore