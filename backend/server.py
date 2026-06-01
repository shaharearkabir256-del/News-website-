from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import re

from seed_data import SEED_ARTICLES, BREAKING_TICKER_ITEMS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="The Chronicle API", version="1.0.0")

api_router = APIRouter(prefix="/api")

# ============================================================
# MODELS
# ============================================================

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    subtitle: Optional[str] = ""
    summary: str
    body: str
    category: str  # world, politics, business, technology, science, culture, sports
    tags: List[str] = []  # breaking, exclusive, analysis, opinion, live, sponsored
    image_url: str
    image_caption: Optional[str] = ""
    author_name: str
    author_avatar: Optional[str] = ""
    author_title: Optional[str] = ""
    is_featured: bool = False
    hero_rank: Optional[int] = None  # 0 = main featured, 1-3 = secondary
    is_trending: bool = False
    trending_rank: Optional[int] = None
    is_opinion: bool = False
    opinion_quote: Optional[str] = ""
    is_video: bool = False
    video_duration: Optional[str] = ""
    read_minutes: int = 5
    views: int = 0
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArticleCreate(BaseModel):
    slug: Optional[str] = None
    title: str
    subtitle: Optional[str] = ""
    summary: str
    body: str
    category: str
    tags: List[str] = []
    image_url: str
    image_caption: Optional[str] = ""
    author_name: str
    author_avatar: Optional[str] = ""
    author_title: Optional[str] = ""
    is_featured: bool = False
    hero_rank: Optional[int] = None
    is_trending: bool = False
    trending_rank: Optional[int] = None
    is_opinion: bool = False
    opinion_quote: Optional[str] = ""
    is_video: bool = False
    video_duration: Optional[str] = ""
    read_minutes: int = 5
    views: int = 0

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    summary: Optional[str] = None
    body: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    image_caption: Optional[str] = None
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    author_title: Optional[str] = None
    is_featured: Optional[bool] = None
    hero_rank: Optional[int] = None
    is_trending: Optional[bool] = None
    trending_rank: Optional[int] = None
    is_opinion: Optional[bool] = None
    opinion_quote: Optional[str] = None
    is_video: Optional[bool] = None
    video_duration: Optional[str] = None
    read_minutes: Optional[int] = None

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    article_slug: str
    author_name: str
    body: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommentCreate(BaseModel):
    author_name: str
    body: str


# ============================================================
# HELPERS
# ============================================================

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def serialize_doc(doc: dict) -> dict:
    """Convert MongoDB doc to JSON-serializable form (handles datetime)."""
    if not doc:
        return doc
    out = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out

def prepare_for_mongo(doc: dict) -> dict:
    """Convert datetime objects to ISO strings before insertion."""
    out = {}
    for k, v in doc.items():
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out


# ============================================================
# STARTUP — Seed Database
# ============================================================

@app.on_event("startup")
async def startup_event():
    """Auto-seed the database on first startup."""
    count = await db.articles.count_documents({})
    if count == 0:
        logger.info("Seeding database with initial Chronicle articles...")
        for art in SEED_ARTICLES:
            doc = prepare_for_mongo(art)
            await db.articles.insert_one(doc)
        logger.info(f"Seeded {len(SEED_ARTICLES)} articles.")
    # Always ensure ticker items exist
    await db.ticker.delete_many({})
    await db.ticker.insert_many([{"id": str(uuid.uuid4()), "text": t} for t in BREAKING_TICKER_ITEMS])


# ============================================================
# ROUTES
# ============================================================

@api_router.get("/")
async def root():
    return {"name": "The Chronicle API", "version": "1.0.0"}

# ---------- ARTICLES ----------

@api_router.get("/articles")
async def list_articles(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    sort: str = "published_at",
    order: str = "desc",
):
    """List articles with optional category, search, pagination."""
    query = {}
    if category and category.lower() != "all":
        query["category"] = category.lower()
    if search:
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [
            {"title": regex},
            {"subtitle": regex},
            {"summary": regex},
            {"body": regex},
            {"tags": regex},
            {"author_name": regex},
        ]

    sort_dir = -1 if order == "desc" else 1
    cursor = db.articles.find(query, {"_id": 0}).sort(sort, sort_dir).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [serialize_doc(d) for d in docs]


@api_router.get("/articles/featured")
async def get_featured_articles():
    """Get the hero featured article + 3 secondary, sorted by hero_rank."""
    cursor = db.articles.find({"is_featured": True}, {"_id": 0}).sort("hero_rank", 1).limit(4)
    docs = await cursor.to_list(length=4)
    return [serialize_doc(d) for d in docs]


@api_router.get("/articles/trending")
async def get_trending_articles():
    """Top trending articles (5)"""
    cursor = db.articles.find({"is_trending": True}, {"_id": 0}).sort("trending_rank", 1).limit(5)
    docs = await cursor.to_list(length=5)
    return [serialize_doc(d) for d in docs]


@api_router.get("/articles/opinion")
async def get_opinion_articles():
    cursor = db.articles.find({"is_opinion": True}, {"_id": 0}).sort("published_at", -1).limit(3)
    docs = await cursor.to_list(length=3)
    return [serialize_doc(d) for d in docs]


@api_router.get("/articles/videos")
async def get_video_articles():
    cursor = db.articles.find({"is_video": True}, {"_id": 0}).sort("published_at", -1).limit(4)
    docs = await cursor.to_list(length=4)
    return [serialize_doc(d) for d in docs]


@api_router.get("/articles/{slug}")
async def get_article_by_slug(slug: str):
    doc = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    # Increment views
    await db.articles.update_one({"slug": slug}, {"$inc": {"views": 1}})
    doc["views"] = doc.get("views", 0) + 1
    return serialize_doc(doc)


@api_router.post("/articles")
async def create_article(article: ArticleCreate):
    data = article.model_dump()
    if not data.get("slug"):
        data["slug"] = slugify(data["title"])
    # ensure unique slug
    existing = await db.articles.find_one({"slug": data["slug"]})
    if existing:
        data["slug"] = f"{data['slug']}-{uuid.uuid4().hex[:6]}"
    new = Article(**data)
    doc = new.model_dump()
    doc = prepare_for_mongo(doc)
    await db.articles.insert_one(doc)
    return serialize_doc(doc)


@api_router.put("/articles/{article_id}")
async def update_article(article_id: str, article: ArticleUpdate):
    updates = {k: v for k, v in article.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.articles.update_one({"id": article_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    doc = await db.articles.find_one({"id": article_id}, {"_id": 0})
    return serialize_doc(doc)


@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"success": True}


# ---------- COMMENTS ----------

@api_router.get("/articles/{slug}/comments")
async def list_comments(slug: str):
    cursor = db.comments.find({"article_slug": slug}, {"_id": 0}).sort("created_at", -1).limit(200)
    docs = await cursor.to_list(length=200)
    return [serialize_doc(d) for d in docs]


@api_router.post("/articles/{slug}/comments")
async def add_comment(slug: str, comment: CommentCreate):
    # ensure article exists
    art = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    new_comment = Comment(article_slug=slug, **comment.model_dump())
    doc = new_comment.model_dump()
    doc = prepare_for_mongo(doc)
    await db.comments.insert_one(doc)
    return serialize_doc(doc)


# ---------- CATEGORIES ----------

@api_router.get("/categories")
async def list_categories():
    return [
        {"slug": "world", "name": "World", "color": "#1A6BAD"},
        {"slug": "politics", "name": "Politics", "color": "#7B2D8B"},
        {"slug": "business", "name": "Business", "color": "#2C6E49"},
        {"slug": "technology", "name": "Technology", "color": "#E07A00"},
        {"slug": "science", "name": "Science", "color": "#0E7C7B"},
        {"slug": "culture", "name": "Culture", "color": "#C44B4B"},
        {"slug": "sports", "name": "Sports", "color": "#1B4F72"},
    ]


# ---------- TICKER ----------

@api_router.get("/ticker")
async def get_ticker():
    docs = await db.ticker.find({}, {"_id": 0}).to_list(length=20)
    return docs


# ---------- SEED ----------

@api_router.post("/seed")
async def reseed_articles():
    """Reset and reseed the canonical 9 articles."""
    await db.articles.delete_many({})
    for art in SEED_ARTICLES:
        doc = prepare_for_mongo(art)
        await db.articles.insert_one(doc)
    return {"success": True, "count": len(SEED_ARTICLES)}


# Mount router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
