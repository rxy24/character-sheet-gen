from datetime import timedelta

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from backend.core.security import *

from backend.core.config import settings


router = APIRouter()

@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@router.post("/create-account")
async def create_new_user(user : UserCreate):
    username = user.username
    if await get_user(username=username) is not None:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    await create_new_account(username=username, password=user.password)


@router.get("/users/current")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user