from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.api.deps import get_current_user
from src.database import load_user_plans, save_plan, delete_item
from src.services.planner_service import create_new_plan, delete_plan, generate_schedule

router = APIRouter()

class GenerateScheduleRequest(BaseModel):
    subjects: str
    weak_subject: str = ""
    start_time: str   # "HH:MM"
    end_time: str     # "HH:MM"
    mood: str = "I feel okay"

class RenameRequest(BaseModel):
    title: str

@router.get("")
def list_plans(username: str = Depends(get_current_user)):
    plans = load_user_plans(username)
    return [{"id": pid, "title": data.get("title", "Untitled"), "has_schedule": bool(data.get("schedule"))}
            for pid, data in plans.items()]

@router.post("")
def create_plan(username: str = Depends(get_current_user)):
    pid, plan = create_new_plan(username)
    return {"id": pid, **plan}

@router.get("/{plan_id}")
def get_plan(plan_id: str, username: str = Depends(get_current_user)):
    plans = load_user_plans(username)
    if plan_id not in plans:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"id": plan_id, **plans[plan_id]}

@router.post("/{plan_id}/generate")
def generate_plan_schedule(plan_id: str, req: GenerateScheduleRequest, username: str = Depends(get_current_user)):
    plans = load_user_plans(username)
    existing = plans.get(plan_id, {
        "subjects": "", "weak": "", "mood": "", "schedule": [],
        "title": "Untitled Plan", "deadlines": [], "study_logs": [], "active_session_idx": 0
    })
    status, result = generate_schedule(
        plan_id, username,
        req.subjects, req.weak_subject,
        req.start_time, req.end_time,
        req.mood, existing
    )
    if status != "OK":
        raise HTTPException(status_code=400, detail=status)
    return {"id": plan_id, **result}

@router.patch("/{plan_id}")
def rename_plan(plan_id: str, req: RenameRequest, username: str = Depends(get_current_user)):
    plans = load_user_plans(username)
    if plan_id not in plans:
        raise HTTPException(status_code=404, detail="Plan not found")
    plans[plan_id]["title"] = req.title
    save_plan(plan_id, plans[plan_id], username)
    return {"message": "Renamed", "id": plan_id, "title": req.title}

@router.delete("/{plan_id}")
def delete_plan_route(plan_id: str, username: str = Depends(get_current_user)):
    delete_plan(plan_id)
    return {"message": "Deleted"}
