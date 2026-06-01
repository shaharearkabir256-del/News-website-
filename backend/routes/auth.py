"""
Auth routes — Emergent Managed Google OAuth.

Flow:
1. Frontend redirects user to https://auth.emergentagent.com/?redirect=<frontend-origin>/profile
2. Google auth happens, user lands at <frontend-origin>/profile#session_id=<id>
3. Frontend extracts session_id from URL hash, POSTs to /api/auth/session
4. We call Emergent's GET https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data
   with X-Session-ID header, receive {id, email, name, picture, session_token}
5. We store the session in MongoDB and set an HTTP-only cookie.

There's also a /api/auth/dev-login endpoint guarded by DEV_AUTH_BYPASS for testing.
"""
import os
import uuid
import httpx
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Request, Response, HTTPException, Depends
from typing import Optional

from db import db, ADMIN_EMAIL, DEV_AUTH_BYPASS
from models import SessionExchange, DevLoginRequest, prepare_for_mongo
from auth_deps import get_current_user, get_required_user

router = APIRouter(prefix="/auth", tags=["auth"])

EMERGENT_SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_TTL_DAYS = 7
COOKIE_NAME = "session_token"


def _user_to_public(user: dict) -> dict:
    email = str(user.get("email", "")).strip().lower()
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "picture": user.get("picture", ""),
        "is_admin": email == ADMIN_EMAIL,
    }


async def _upsert_user_and_session(
    email: str, name: str, picture: str, session_token: str
) -> dict:
    """
    Upsert the user by email and create a session record.
    Returns the user dict.
    """
    email_l = email.strip().lower()
    existing = await db.users.find_one({"email": email_l}, {"_id": 0})
    if existing:
        await db.users.update_one(
            {"user_id": existing["user_id"]},
            {"$set": {"name": name, "picture": picture}},
        )
        user = await db.users.find_one({"user_id": existing["user_id"]}, {"_id": 0})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = {
            "user_id": user_id,
            "email": email_l,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(new_user)
        user = new_user

    # store session (replace any existing token if collision)
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    session_doc = {
        "session_token": session_token,
        "user_id": user["user_id"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires_at.isoformat(),
    }
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {"$set": session_doc},
        upsert=True,
    )
    return user


def _set_session_cookie(response: Response, token: str):
    # Per playbook: HttpOnly, Secure, SameSite=None, path=/
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=SESSION_TTL_DAYS * 24 * 3600,
        path="/",
        httponly=True,
        secure=True,
        samesite="none",
    )


# ----------- ENDPOINTS -----------

@router.post("/session")
async def exchange_session(payload: SessionExchange, response: Response):
    """
    Exchange an Emergent session_id (from URL fragment) for a persistent session_token.
    Stores user in MongoDB and sets HttpOnly cookie.
    """
    if not payload.session_id:
        raise HTTPException(status_code=400, detail="session_id required")

    async with httpx.AsyncClient(timeout=15.0) as cli:
        try:
            r = await cli.get(
                EMERGENT_SESSION_DATA_URL,
                headers={"X-Session-ID": payload.session_id},
            )
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Auth provider unreachable: {e}")

    if r.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid session: {r.text[:200]}",
        )
    data = r.json()

    email = data.get("email")
    name = data.get("name") or email
    picture = data.get("picture") or ""
    session_token = data.get("session_token")
    if not email or not session_token:
        raise HTTPException(status_code=502, detail="Auth provider missing fields")

    user = await _upsert_user_and_session(email, name, picture, session_token)
    _set_session_cookie(response, session_token)
    return _user_to_public(user)


@router.post("/dev-login")
async def dev_login(payload: DevLoginRequest, response: Response):
    """
    Testing-only: create a session for any email. Disabled when DEV_AUTH_BYPASS=false.
    """
    if not DEV_AUTH_BYPASS:
        raise HTTPException(status_code=404, detail="Not found")

    session_token = f"dev_{uuid.uuid4().hex}"
    user = await _upsert_user_and_session(
        payload.email, payload.name or payload.email, payload.picture or "", session_token
    )
    _set_session_cookie(response, session_token)
    out = _user_to_public(user)
    # ALSO return the token so tools that can't accept cookies can use Authorization Bearer.
    out["session_token"] = session_token
    return out


@router.get("/me")
async def me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return _user_to_public(user)


@router.post("/logout")
async def logout(request: Request, response: Response):
    # Find token from cookie/header
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        auth = request.headers.get("Authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    # Clear cookie regardless
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"success": True}
