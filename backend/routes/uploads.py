"""
Uploads route — admin uploads image, server compresses to WebP (≤1600px, quality 75) and stores in /app/backend/uploads.
Returns the public URL: /api/uploads/<filename>.webp

User spec: WebP, max 800px width, quality 75. We use max 800 here.
"""
import uuid
import io
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from PIL import Image, UnidentifiedImageError

from db import UPLOADS_DIR
from auth_deps import get_admin_user

router = APIRouter(tags=["uploads"])

MAX_WIDTH = 800
WEBP_QUALITY = 75
MAX_FILE_BYTES = 12 * 1024 * 1024  # 12 MB raw upload cap

ALLOWED_INPUT_MIMES = {
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "image/bmp", "image/tiff", "image/heic", "image/heif",
}


@router.post("/admin/upload-image")
async def upload_image(file: UploadFile = File(...), admin=Depends(get_admin_user)):
    # Validate content type
    ctype = (file.content_type or "").lower()
    if ctype and ctype not in ALLOWED_INPUT_MIMES:
        raise HTTPException(status_code=400, detail=f"Unsupported content-type: {ctype}")

    # Read up to limit + 1 to detect oversize
    raw = await file.read(MAX_FILE_BYTES + 1)
    if len(raw) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 12 MB)")
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file")

    # Decode
    try:
        img = Image.open(io.BytesIO(raw))
        img.load()
    except (UnidentifiedImageError, Exception) as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image: {e}")

    # Convert to RGB if necessary (WebP lossy doesn't support some modes)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")

    # Resize if wider than MAX_WIDTH
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / float(img.width)
        new_h = int(img.height * ratio)
        img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)

    # Save as WebP
    filename = f"{uuid.uuid4().hex}.webp"
    out_path = UPLOADS_DIR / filename
    save_kwargs = {"format": "WEBP", "quality": WEBP_QUALITY, "method": 6}
    img.save(out_path, **save_kwargs)

    return {
        "url": f"/api/uploads/{filename}",
        "filename": filename,
        "width": img.width,
        "height": img.height,
        "size_bytes": out_path.stat().st_size,
    }


@router.get("/uploads/{filename}")
async def serve_upload(filename: str):
    # Prevent path traversal
    if "/" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    path = UPLOADS_DIR / filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(path, media_type="image/webp", headers={"Cache-Control": "public, max-age=31536000"})
