import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.api.deps import get_current_user
from src.database import load_user_summaries, save_summary, delete_item
from src.ai_engines import get_summary

router = APIRouter()

class GenerateRequest(BaseModel):
    text: str
    word_count: int = 80
    format_style: str = "Plain Text"

class RenameRequest(BaseModel):
    title: str

@router.get("")
def list_summaries(username: str = Depends(get_current_user)):
    summaries = load_user_summaries(username)
    return [{"id": sid, "title": data.get("title", "Untitled"), "has_output": bool(data.get("summary"))}
            for sid, data in summaries.items()]

@router.post("")
def create_summary(username: str = Depends(get_current_user)):
    sid = f"summary_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    data = {"text": "", "summary": "", "word_count": 80, "format_style": "Plain Text", "title": "Untitled Summary"}
    save_summary(sid, data, username)
    return {"id": sid, **data}

@router.get("/{summary_id}")
def get_summary_item(summary_id: str, username: str = Depends(get_current_user)):
    summaries = load_user_summaries(username)
    if summary_id not in summaries:
        raise HTTPException(status_code=404, detail="Summary not found")
    return {"id": summary_id, **summaries[summary_id]}

@router.post("/{summary_id}/generate")
def generate_summary(summary_id: str, req: GenerateRequest, username: str = Depends(get_current_user)):
    if len(req.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text too short (min 20 characters)")
    summaries = load_user_summaries(username)
    data = summaries.get(summary_id, {
        "text": "", "summary": "", "word_count": 80, "format_style": "Plain Text", "title": "Untitled Summary"
    })
    formatted, engine = get_summary(req.text, req.word_count, req.format_style, username)
    data.update({
        "text": req.text,
        "summary": formatted,
        "word_count": req.word_count,
        "format_style": req.format_style,
        "engine": engine,
    })
    if data.get("title", "").startswith("Untitled"):
        data["title"] = req.text[:30] + "..."
    save_summary(summary_id, data, username)
    return {"id": summary_id, **data}

@router.patch("/{summary_id}")
def rename_summary(summary_id: str, req: RenameRequest, username: str = Depends(get_current_user)):
    summaries = load_user_summaries(username)
    if summary_id not in summaries:
        raise HTTPException(status_code=404, detail="Summary not found")
    summaries[summary_id]["title"] = req.title
    save_summary(summary_id, summaries[summary_id], username)
    return {"message": "Renamed", "id": summary_id, "title": req.title}

@router.delete("/{summary_id}")
def delete_summary(summary_id: str, username: str = Depends(get_current_user)):
    delete_item("summary", summary_id)
    return {"message": "Deleted"}
