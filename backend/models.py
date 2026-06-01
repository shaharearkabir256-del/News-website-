"""
Pydantic models — shared.
"""
from datetime import datetime, timezone
from typing import List, Optional
import uuid
from pydantic import BaseModel, Field, ConfigDict, EmailStr


# ============================================================
# ARTICLES
# ============================================================

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
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


# ============================================================
# COMMENTS
# ============================================================

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    article_slug: str
    author_name: str
    body: str
    is_hidden: bool = False
    user_id: Optional[str] = None
    user_picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CommentCreate(BaseModel):
    author_name: str
    body: str


# ============================================================
# USERS / AUTH
# ============================================================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")

    user_id: str
    email: str
    name: str
    picture: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserPublic(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = ""
    is_admin: bool = False


class DevLoginRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = "Test User"
    picture: Optional[str] = ""


class SessionExchange(BaseModel):
    session_id: str


# ============================================================
# BOOKMARKS
# ============================================================

class Bookmark(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    article_slug: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================
# NEWSLETTER
# ============================================================

class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================
# HELPERS
# ============================================================

def prepare_for_mongo(doc: dict) -> dict:
    """Convert datetime objects to ISO strings before insertion."""
    out = {}
    for k, v in doc.items():
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out


def serialize_doc(doc):
    """Convert MongoDB doc to JSON-serializable form."""
    if not doc:
        return doc
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    out = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out
