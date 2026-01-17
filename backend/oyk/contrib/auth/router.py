from fastapi import APIRouter, Depends
from oyk.core.dependencies import get_db

router = APIRouter()


@router.get("/me/")
def get_auth_me(db=Depends(get_db)):
    print(">>> ", db)
    return {
        "test": True
    }
