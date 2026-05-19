import sqlite3

import bcrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..auth import create_token
from ..database import DB_PATH

router = APIRouter(prefix="/api/auth")


class AuthRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str


def _hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def _verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


@router.post("/signup", response_model=AuthResponse)
def signup(req: AuthRequest) -> AuthResponse:
    if len(req.password) < 8:
        raise HTTPException(status_code=422, detail="パスワードは8文字以上で入力してください")
    hashed = _hash_password(req.password)
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (req.email, hashed),
            )
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="このメールアドレスはすでに登録されています")
    if user_id is None:
        raise HTTPException(status_code=500, detail="ユーザー登録に失敗しました")
    return AuthResponse(token=create_token(user_id))


@router.post("/signin", response_model=AuthResponse)
def signin(req: AuthRequest) -> AuthResponse:
    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute(
            "SELECT id, password_hash FROM users WHERE email = ?", (req.email,)
        ).fetchone()
    if not row or not _verify_password(req.password, row[1]):
        raise HTTPException(status_code=401, detail="メールアドレスまたはパスワードが正しくありません")
    return AuthResponse(token=create_token(row[0]))
