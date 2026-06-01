"""
Bookmarks routes — toggle/list/check, all require auth.
"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
import uuid

from db import db
from models import Bookmark, prepare_for_mongo, serialize_doc
from auth_deps import get_required_user

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("")
async def list_bookmarks(user=Depends(get_required_user)):
    """
    Return the current user's bookmarked articles — each merged with article data.
    """
    cursor = db.bookmarks.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).limit(500)
    bookmarks = await cursor.to_list(length=500)
    slugs = [b["article_slug"] for b in bookmarks]
    if not slugs:
        return []
    articles_cursor = db.articles.find({"slug": {"$in": slugs}}, {"_id": 0})
    articles = await articles_cursor.to_list(length=len(slugs))
    by_slug = {a["slug"]: a for a in articles}
    out = []
    for b in bookmarks:
        a = by_slug.get(b["article_slug"])
        if not a:
            continue
        out.append(serialize_doc(a))
    return out


@router.get("/slugs")
async def list_bookmark_slugs(user=Depends(get_required_user)):
    """Light endpoint: just slug list, used by frontend to render heart-state on cards."""
    cursor = db.bookmarks.find({"user_id": user["user_id"]}, {"_id": 0, "article_slug": 1}).limit(2000)
    docs = await cursor.to_list(length=2000)
    return [d["article_slug"] for d in docs]


@router.post("/{slug}")
async def toggle_bookmark(slug: str, user=Depends(get_required_user)):
    """
    Toggle: if exists, delete and return {bookmarked: false}; else create and return {bookmarked: true}.
    """
    art = await db.articles.find_one({"slug": slug}, {"_id": 0, "slug": 1})
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    existing = await db.bookmarks.find_one({"user_id": user["user_id"], "article_slug": slug})
    if existing:
        await db.bookmarks.delete_one({"_id": existing["_id"]})
        return {"bookmarked": False}
    new = Bookmark(user_id=user["user_id"], article_slug=slug)
    doc = prepare_for_mongo(new.model_dump())
    await db.bookmarks.insert_one(doc)
    return {"bookmarked": True}


@router.delete("/{slug}")
async def unbookmark(slug: str, user=Depends(get_required_user)):
    r = await db.bookmarks.delete_one({"user_id": user["user_id"], "article_slug": slug})
    return {"removed": r.deleted_count > 0}
