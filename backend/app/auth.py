import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# AI: JWT_SECRETが未設定の場合、起動ごとにランダム生成（DBリセット要件と整合）
_JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_hex(32))
_ALGORITHM = "HS256"
_EXPIRE_HOURS = 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")


def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=_EXPIRE_HOURS),
    }
    return jwt.encode(payload, _JWT_SECRET, algorithm=_ALGORITHM)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> int:
    try:
        payload = jwt.decode(token, _JWT_SECRET, algorithms=[_ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="認証が必要です")
    return user_id
