"""
Comments routes — public list/create + admin moderation (hide/unhide/delete + admin list).
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Optional, List

from db import db
from models import Comment, CommentCreate, prepare_for_mongo, serialize_doc
from auth_deps import get_current_user, get_admin_user

router = APIRouter(tags=["comments"])


# ---------- PUBLIC ----------

@router.get("/articles/{slug}/comments")
async def list_comments(slug: str, request: Request):
    """
    Public: list visible comments. Admins also see hidden ones (flagged).
    """
    user = await get_current_user(request)
    is_admin = bool(user and user.get("is_admin"))
    query = {"article_slug": slug}
    if not is_admin:
        query["is_hidden"] = {"$ne": True}
    cursor = db.comments.find(query, {"_id": 0}).sort("created_at", -1).limit(500)
    docs = await cursor.to_list(length=500)
    return [serialize_doc(d) for d in docs]


@router.post("/articles/{slug}/comments")
async def add_comment(slug: str, comment: CommentCreate, request: Request):
    art = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    user = await get_current_user(request)
    new_comment = Comment(
        article_slug=slug,
        author_name=(user["name"] if user else comment.author_name).strip()[:80] or "Anonymous",
        body=comment.body.strip()[:1500],
        user_id=(user["user_id"] if user else None),
        user_picture=(user.get("picture") if user else None),
    )
    doc = prepare_for_mongo(new_comment.model_dump())
    await db.comments.insert_one(doc)
    return serialize_doc(doc)


# ---------- ADMIN MODERATION ----------

admin_router = APIRouter(prefix="/admin", tags=["admin"])


@admin_router.get("/comments")
async def admin_list_all_comments(
    admin=Depends(get_admin_user),
    status: Optional[str] = None,  # "hidden" | "visible" | None
    limit: int = 500,
):
    query = {}
    if status == "hidden":
        query["is_hidden"] = True
    elif status == "visible":
        query["is_hidden"] = {"$ne": True}
    cursor = db.comments.find(query, {"_id": 0}).sort("created_at", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [serialize_doc(d) for d in docs]


@admin_router.post("/comments/{comment_id}/hide")
async def admin_hide_comment(comment_id: str, admin=Depends(get_admin_user)):
    result = await db.comments.update_one({"id": comment_id}, {"$set": {"is_hidden": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"success": True}


@admin_router.post("/comments/{comment_id}/unhide")
async def admin_unhide_comment(comment_id: str, admin=Depends(get_admin_user)):
    result = await db.comments.update_one({"id": comment_id}, {"$set": {"is_hidden": False}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"success": True}


@admin_router.delete("/comments/{comment_id}")
async def admin_delete_comment(comment_id: str, admin=Depends(get_admin_user)):
    result = await db.comments.delete_one({"id": comment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"success": True}


class BulkRequest(dict):
    pass


@admin_router.post("/comments/bulk")
async def admin_bulk_action(payload: dict, admin=Depends(get_admin_user)):
    """
    Bulk action on comments. payload = {"ids": [...], "action": "hide"|"unhide"|"delete"}
    """
    ids = payload.get("ids") or []
    action = payload.get("action")
    if not ids or not isinstance(ids, list):
        raise HTTPException(status_code=400, detail="ids required")
    if action == "hide":
        r = await db.comments.update_many({"id": {"$in": ids}}, {"$set": {"is_hidden": True}})
        return {"affected": r.modified_count}
    if action == "unhide":
        r = await db.comments.update_many({"id": {"$in": ids}}, {"$set": {"is_hidden": False}})
        return {"affected": r.modified_count}
    if action == "delete":
        r = await db.comments.delete_many({"id": {"$in": ids}})
        return {"affected": r.deleted_count}
    raise HTTPException(status_code=400, detail="unknown action")
