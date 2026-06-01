"""
MongoDB connection — shared across all routers.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Convenience admin email
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@example.com').strip().lower()
DEV_AUTH_BYPASS = os.environ.get('DEV_AUTH_BYPASS', 'false').lower() == 'true'
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
