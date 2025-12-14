from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from pydantic import BaseModel
from jwt.exceptions import InvalidTokenError
from backend.core.repositories.user_repository import UserRepository
from backend.core.config import settings

import jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
user_crud = UserRepository()

class Token(BaseModel):
    access_token: str
    token_type : str

class UserCreate(BaseModel):
    username : str
    password : str

class User(BaseModel):
    username : str
    hashed_password: str
    
class TokenData(BaseModel):
    username: str | None = None

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    
    user = await get_user(username=token_data.username) # type: ignore
    
    if user is None:
        raise credentials_exception
    return user

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)

async def get_user(username : str) -> User | None:
    result = await user_crud.get_user_info(username=username)
    if result is None:
        return None
    else:
        return User.model_validate(result)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, hashed_password=user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    generate_token = settings.SECRET_KEY
    encoded_jwt = jwt.encode(to_encode, generate_token, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def create_new_account(username : str, password : str):
    hashed_pass = get_password_hash(password=password)
    model = User(username=username, hashed_password=hashed_pass)
    result = model.model_dump()
    await user_crud.create_user_info(accountInsert=result)

password_hash = PasswordHash.recommended()