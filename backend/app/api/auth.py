from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    node_token: str = None

@router.post("/login")
def login(req: LoginRequest):
    return {
        "access_token": "aqi_token_demo_ariyan_2026",
        "token_type": "bearer",
        "user": {
            "name": "Ariyan",
            "email": req.email,
            "role": "Lead Environmental Analyst"
        }
    }

@router.post("/register")
def register(req: RegisterRequest):
    return {
        "access_token": "aqi_token_new_user",
        "token_type": "bearer",
        "user": {
            "name": req.name,
            "email": req.email,
            "role": "Analyst"
        }
    }
