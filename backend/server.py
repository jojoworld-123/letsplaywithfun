from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Computer Champ API")
api_router = APIRouter(prefix="/api")


# ----- Models -----
class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    student_class: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    progress: Dict[str, Any] = Field(default_factory=dict)
    stars: int = 0
    badges: list = Field(default_factory=list)


class StudentCreate(BaseModel):
    name: str
    student_class: str


class ScoreUpdate(BaseModel):
    student_id: str
    level_id: str
    stars: int
    completed: bool = True


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Computer Champ API is running", "ok": True}


@api_router.post("/students", response_model=Student)
async def create_student(payload: StudentCreate):
    student = Student(name=payload.name.strip(), student_class=payload.student_class.strip())
    doc = student.model_dump()
    await db.students.insert_one(doc)
    return student


@api_router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: str):
    doc = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Student not found")
    return Student(**doc)


@api_router.post("/scores")
async def update_score(payload: ScoreUpdate):
    student = await db.students.find_one({"id": payload.student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    progress = student.get("progress", {}) or {}
    prev = progress.get(payload.level_id, {"stars": 0, "completed": False})
    new_stars = max(prev.get("stars", 0), payload.stars)
    progress[payload.level_id] = {"stars": new_stars, "completed": payload.completed or prev.get("completed", False)}

    total_stars = sum(item.get("stars", 0) for item in progress.values())

    badges = student.get("badges", []) or []
    earned = []
    if total_stars >= 5 and "starter" not in badges:
        earned.append("starter")
    if total_stars >= 15 and "explorer" not in badges:
        earned.append("explorer")
    if total_stars >= 30 and "champ" not in badges:
        earned.append("champ")
    badges = list(set(badges + earned))

    await db.students.update_one(
        {"id": payload.student_id},
        {"$set": {"progress": progress, "stars": total_stars, "badges": badges}},
    )
    return {"ok": True, "stars": total_stars, "progress": progress, "badges": badges, "earned": earned}


@api_router.post("/certificate/issue")
async def issue_certificate(payload: dict):
    """Mark certificate as issued (free for all parents)."""
    sid = payload.get("student_id")
    if not sid:
        raise HTTPException(status_code=400, detail="student_id required")
    await db.students.update_one(
        {"id": sid},
        {"$set": {"certificate_issued_at": datetime.now(timezone.utc).isoformat()}},
    )
    return {"ok": True, "issued": True}


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
