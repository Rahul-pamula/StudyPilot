import random
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from src.database import get_user, get_user_by_email, create_user, update_user_password, hash_password
from src.services.auth_service import validate_email, send_otp_email, store_otp, verify_otp, clear_otp
from src.api.deps import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    email: str

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

class RegisterCompleteRequest(BaseModel):
    email: str
    otp: str
    username: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

@router.post("/login")
def login(req: LoginRequest):
    user = get_user(req.username.strip())
    if not user or user["password"] != hash_password(req.password.strip()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    token = create_access_token(req.username.strip())
    return {"access_token": token, "token_type": "bearer", "username": req.username.strip(), "email": user["email"]}

@router.post("/register/request-otp")
def register_request_otp(req: OTPRequest):
    if not validate_email(req.email.strip()):
        raise HTTPException(status_code=400, detail="Invalid email address")
    existing = get_user_by_email(req.email.strip())
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    otp = str(random.randint(100000, 999999))
    store_otp(req.email.strip(), otp)
    ok, err = send_otp_email(req.email.strip(), otp)
    if not ok:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {err}")
    return {"message": f"OTP sent to {req.email.strip()}"}

@router.post("/register/verify-otp")
def register_verify_otp(req: OTPVerifyRequest):
    if not verify_otp(req.email.strip(), req.otp.strip()):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "OTP verified"}

@router.post("/register/complete")
def register_complete(req: RegisterCompleteRequest):
    if not verify_otp(req.email.strip(), req.otp.strip()):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    if get_user(req.username.strip()):
        raise HTTPException(status_code=400, detail="Username already taken")
    if get_user_by_email(req.email.strip()):
        raise HTTPException(status_code=400, detail="Email already registered")
    if len(req.username.strip()) < 3:
        raise HTTPException(status_code=400, detail="Username too short (min 3 characters)")
    if len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Password too short (min 4 characters)")
    create_user(req.username.strip(), req.email.strip(), hash_password(req.password))
    clear_otp(req.email.strip())
    token = create_access_token(req.username.strip())
    return {"access_token": token, "token_type": "bearer", "username": req.username.strip(), "email": req.email.strip()}

@router.post("/forgot-password/request-otp")
def forgot_request_otp(req: OTPRequest):
    user = get_user_by_email(req.email.strip())
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")
    otp = str(random.randint(100000, 999999))
    store_otp(req.email.strip(), otp)
    ok, err = send_otp_email(req.email.strip(), otp)
    if not ok:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {err}")
    return {"message": "Reset OTP sent"}

@router.post("/forgot-password/reset")
def reset_password(req: ResetPasswordRequest):
    if not verify_otp(req.email.strip(), req.otp.strip()):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    user = get_user_by_email(req.email.strip())
    if not user:
        raise HTTPException(status_code=404, detail="Account not found")
    if len(req.new_password) < 4:
        raise HTTPException(status_code=400, detail="Password too short")
    update_user_password(user["username"], hash_password(req.new_password))
    clear_otp(req.email.strip())
    return {"message": "Password updated successfully"}
