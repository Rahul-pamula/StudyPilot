import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.api.deps import get_current_user
from src.database import load_user_chats, save_chat, delete_item
from src.ai_engines import get_chat_response
from src.services.chat_service import create_new_chat

router = APIRouter()

class SendMessageRequest(BaseModel):
    message: str

class RenameRequest(BaseModel):
    title: str

@router.get("")
def list_chats(username: str = Depends(get_current_user)):
    chats = load_user_chats(username)
    result = []
    for cid, msgs in chats.items():
        label = msgs[0]["text"][:40] + "…" if msgs else "New Chat"
        result.append({"id": cid, "label": label, "message_count": len(msgs)})
    return result

@router.post("")
def create_chat(username: str = Depends(get_current_user)):
    cid, msgs = create_new_chat(username)
    return {"id": cid, "messages": msgs}

@router.get("/{chat_id}")
def get_chat(chat_id: str, username: str = Depends(get_current_user)):
    chats = load_user_chats(username)
    if chat_id not in chats:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"id": chat_id, "messages": chats[chat_id]}

@router.post("/{chat_id}/message")
def send_message(chat_id: str, req: SendMessageRequest, username: str = Depends(get_current_user)):
    chats = load_user_chats(username)
    messages = chats.get(chat_id, [])
    answer, sentiment = get_chat_response(req.message, messages)
    messages.append({"role": "user",      "text": req.message})
    messages.append({"role": "assistant", "text": answer})
    save_chat(chat_id, messages, username)
    return {
        "reply": answer,
        "sentiment": sentiment,
        "messages": messages
    }

@router.delete("/{chat_id}")
def delete_chat(chat_id: str, username: str = Depends(get_current_user)):
    delete_item("chat", chat_id)
    return {"message": "Chat deleted"}

@router.patch("/{chat_id}")
def rename_chat(chat_id: str, req: RenameRequest, username: str = Depends(get_current_user)):
    chats = load_user_chats(username)
    if chat_id not in chats:
        raise HTTPException(status_code=404, detail="Chat not found")
    save_chat(chat_id, chats[chat_id], username)
    return {"message": "Renamed", "id": chat_id, "title": req.title}
