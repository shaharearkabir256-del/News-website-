"""
Misc routes — categories + ticker.
"""
from fastapi import APIRouter
from db import db
from models import serialize_doc
from seed_data import BREAKING_TICKER_ITEMS
import uuid

router = APIRouter(tags=["misc"])


@router.get("/categories")
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


@router.get("/ticker")
async def get_ticker():
    docs = await db.ticker.find({}, {"_id": 0}).to_list(length=20)
    return [serialize_doc(d) for d in docs]
