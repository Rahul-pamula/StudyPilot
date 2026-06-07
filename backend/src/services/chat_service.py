import datetime
from src.database import save_chat, delete_item

def create_new_chat(username: str) -> tuple[str, list]:
    cid = f"chat_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    save_chat(cid, [], username)
    return cid, []

def delete_chat_record(chat_id: str) -> None:
    delete_item("chat", chat_id)
