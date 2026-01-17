from fastapi import FastAPI
from oyk.contrib.auth.router import router as auth_router

app = FastAPI(
    title="Oykus"
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
