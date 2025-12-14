from fastapi import FastAPI
from backend.api.routes import security_router, spell_router, class_router, character_router
from fastapi_pagination import add_pagination

app = FastAPI()
app.include_router(spell_router.router)
app.include_router(security_router.router)
app.include_router(class_router.router)
app.include_router(character_router.router)
add_pagination(app)