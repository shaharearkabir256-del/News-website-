"""
Articles routes — list/search/featured/trending/opinion/videos, detail, CRUD (admin), related.
"""
import re
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List

from db import db
from models import (
    Article,
    ArticleCreate,
    ArticleUpdate,
    serialize_doc,
    prepare_for_mongo,
)
from auth_deps import get_admin_user, get_current_user
from seed_data import SEED_ARTICLES

router = APIRouter(prefix="/articles", tags=["articles"])


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')


@router.get("")
async def list_articles(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    sort: str = "published_at",
    order: str = "desc",
):
    query = {}
    if category and category.lower() != "all":
        query["category"] = category.lower()
    if search:
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [
            {"title": regex}, {"subtitle": regex}, {"summary": regex},
            {"body": regex}, {"tags": regex}, {"author_name": regex},
        ]
    sort_dir = -1 if order == "desc" else 1
    cursor = db.articles.find(query, {"_id": 0}).sort(sort, sort_dir).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [serialize_doc(d) for d in docs]


@router.get("/featured")
async def get_featured_articles():
    cursor = db.articles.find({"is_featured": True}, {"_id": 0}).sort("hero_rank", 1).limit(4)
    docs = await cursor.to_list(length=4)
    return [serialize_doc(d) for d in docs]


@router.get("/trending")
async def get_trending_articles():
    cursor = db.articles.find({"is_trending": True}, {"_id": 0}).sort("trending_rank", 1).limit(5)
    docs = await cursor.to_list(length=5)
    return [serialize_doc(d) for d in docs]


@router.get("/opinion")
async def get_opinion_articles():
    cursor = db.articles.find({"is_opinion": True}, {"_id": 0}).sort("published_at", -1).limit(3)
    docs = await cursor.to_list(length=3)
    return [serialize_doc(d) for d in docs]


@router.get("/videos")
async def get_video_articles():
    cursor = db.articles.find({"is_video": True}, {"_id": 0}).sort("published_at", -1).limit(4)
    docs = await cursor.to_list(length=4)
    return [serialize_doc(d) for d in docs]


@router.get("/{slug}")
async def get_article_by_slug(slug: str):
    doc = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.articles.update_one({"slug": slug}, {"$inc": {"views": 1}})
    doc["views"] = doc.get("views", 0) + 1
    return serialize_doc(doc)


@router.get("/{slug}/related")
async def get_related_articles(slug: str, limit: int = 3):
    """
    Return related articles (same category, excluding the current one).
    Falls back to most recent if not enough in the same category.
    """
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    category = article.get("category")
    # same category, exclude this slug, exclude opinion/video noise
    cursor = (
        db.articles.find(
            {
                "category": category,
                "slug": {"$ne": slug},
                "is_opinion": {"$ne": True},
                "is_video": {"$ne": True},
            },
            {"_id": 0},
        )
        .sort("published_at", -1)
        .limit(limit)
    )
    docs = await cursor.to_list(length=limit)
    if len(docs) < limit:
        # backfill with other recent articles
        existing_slugs = {d["slug"] for d in docs} | {slug}
        more = (
            db.articles.find(
                {
                    "slug": {"$nin": list(existing_slugs)},
                    "is_opinion": {"$ne": True},
                    "is_video": {"$ne": True},
                },
                {"_id": 0},
            )
            .sort("published_at", -1)
            .limit(limit - len(docs))
        )
        backfill = await more.to_list(length=limit - len(docs))
        docs.extend(backfill)
    return [serialize_doc(d) for d in docs]


# ---------- ADMIN-ONLY MUTATIONS ----------

@router.post("")
async def create_article(article: ArticleCreate, admin=Depends(get_admin_user)):
    data = article.model_dump()
    if not data.get("slug"):
        data["slug"] = _slugify(data["title"])
    existing = await db.articles.find_one({"slug": data["slug"]})
    if existing:
        data["slug"] = f"{data['slug']}-{uuid.uuid4().hex[:6]}"
    new = Article(**data)
    doc = prepare_for_mongo(new.model_dump())
    await db.articles.insert_one(doc)
    return serialize_doc(doc)


@router.put("/{article_id}")
async def update_article(article_id: str, article: ArticleUpdate, admin=Depends(get_admin_user)):
    updates = {k: v for k, v in article.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.articles.update_one({"id": article_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    doc = await db.articles.find_one({"id": article_id}, {"_id": 0})
    return serialize_doc(doc)


@router.delete("/{article_id}")
async def delete_article(article_id: str, admin=Depends(get_admin_user)):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"success": True}


# ---------- SEED (admin) ----------

seed_router = APIRouter(tags=["admin"])


@seed_router.post("/seed")
async def reseed_articles(admin=Depends(get_admin_user)):
    await db.articles.delete_many({})
    for art in SEED_ARTICLES:
        doc = prepare_for_mongo(art)
        await db.articles.insert_one(doc)
    return {"success": True, "count": len(SEED_ARTICLES)}
