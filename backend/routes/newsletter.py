"""
Newsletter routes — public subscribe + admin list.
"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
import uuid

from db import db
from models import NewsletterSubscribe, NewsletterSubscriber, prepare_for_mongo, serialize_doc
from auth_deps import get_admin_user

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe")
async def subscribe(payload: NewsletterSubscribe):
    email = payload.email.lower().strip()
    existing = await db.newsletter_subscribers.find_one({"email": email})
    if existing:
        return {"success": True, "already_subscribed": True}
    new = NewsletterSubscriber(email=email)
    doc = prepare_for_mongo(new.model_dump())
    await db.newsletter_subscribers.insert_one(doc)
    return {"success": True, "already_subscribed": False}


@router.get("")
async def list_subscribers(admin=Depends(get_admin_user), limit: int = 1000):
    cursor = db.newsletter_subscribers.find({}, {"_id": 0}).sort("subscribed_at", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [serialize_doc(d) for d in docs]


@router.delete("/{email}")
async def remove_subscriber(email: str, admin=Depends(get_admin_user)):
    r = await db.newsletter_subscribers.delete_one({"email": email.lower().strip()})
    return {"removed": r.deleted_count > 0}
