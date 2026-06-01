"""
Auth dependency — validate session_token from cookie or Authorization header,
return the current user. Per the Emergent Auth playbook.
"""
import os
from datetime import datetime, timezone
from typing import Optional
from fastapi import Request, HTTPException, status

from db import db, ADMIN_EMAIL


async def _resolve_session_token(request: Request) -> Optional[str]:
    # 1) Try cookie first
    token = request.cookies.get("session_token")
    if token:
        return token
    # 2) Fall back to Authorization: Bearer <token>
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth and auth.lower().startswith("bearer "):
        return auth.split(" ", 1)[1].strip()
    return None


async def get_current_user(request: Request) -> Optional[dict]:
    """
    Return the current user dict if authenticated, else None.
    Use `get_required_user` for endpoints that MUST have a user.
    """
    token = await _resolve_session_token(request)
    if not token:
        return None

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None

    # Check expiry (per playbook — handle naive datetimes)
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        try:
            expires_at = datetime.fromisoformat(expires_at)
        except Exception:
            return None
    if expires_at is None:
        return None
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None

    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        return None

    is_admin = str(user.get("email", "")).strip().lower() == ADMIN_EMAIL
    user["is_admin"] = is_admin
    return user


async def get_required_user(request: Request) -> dict:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


async def get_admin_user(request: Request) -> dict:
    user = await get_required_user(request)
    if not user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return user
