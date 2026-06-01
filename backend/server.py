"""
The Chronicle \u2014 main FastAPI app entrypoint.

All routes are prefixed with /api by including the api_router.
"""
import os
import uuid
import logging
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from db import db, client
from models import prepare_for_mongo
from seed_data import SEED_ARTICLES, BREAKING_TICKER_ITEMS
from routes.auth import router as auth_router
from routes.articles import router as articles_router, seed_router as articles_seed_router
from routes.comments import router as comments_router, admin_router as comments_admin_router
from routes.bookmarks import router as bookmarks_router
from routes.newsletter import router as newsletter_router
from routes.uploads import router as uploads_router
from routes.misc import router as misc_router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="The Chronicle API", version="2.0.0")

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"name": "The Chronicle API", "version": "2.0.0"}


# Mount each domain router under /api
api_router.include_router(auth_router)
api_router.include_router(articles_router)
api_router.include_router(articles_seed_router)
api_router.include_router(comments_router)
api_router.include_router(comments_admin_router)
api_router.include_router(bookmarks_router)
api_router.include_router(newsletter_router)
api_router.include_router(uploads_router)
api_router.include_router(misc_router)

app.include_router(api_router)


# ============================================================
# STARTUP \u2014 Seed Database
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
    # Always ensure ticker items exist (refresh on every startup)
    await db.ticker.delete_many({})
    await db.ticker.insert_many(
        [{"id": str(uuid.uuid4()), "text": t} for t in BREAKING_TICKER_ITEMS]
    )
    # Ensure indexes on commonly queried fields
    await db.articles.create_index("slug", unique=True)
    await db.articles.create_index("id", unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.user_sessions.create_index("session_token", unique=True)
    await db.user_sessions.create_index("user_id")
    await db.bookmarks.create_index([("user_id", 1), ("article_slug", 1)], unique=True)
    await db.newsletter_subscribers.create_index("email", unique=True)
    await db.comments.create_index("article_slug")
    await db.comments.create_index("id", unique=True)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ============================================================
# CORS
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
