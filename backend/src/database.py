import sqlite3
import json
import hashlib
from src.config import DB_FILE

def get_conn():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                email    TEXT NOT NULL,
                password TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS chats (
                id       TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                messages TEXT NOT NULL DEFAULT '[]'
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS summaries (
                id       TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                data     TEXT NOT NULL DEFAULT '{}'
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS plans (
                id       TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                data     TEXT NOT NULL DEFAULT '{}'
            )
        """)
        existing = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if existing == 0:
            conn.execute(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                ("admin", "admin@studypilot.com", hash_password("student123")),
            )

def save_chat(chat_id: str, messages: list, username: str):
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO chats (id, username, messages) VALUES (?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET messages=excluded.messages""",
            (chat_id, username, json.dumps(messages, ensure_ascii=False)),
        )

def save_summary(summary_id: str, data: dict, username: str):
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO summaries (id, username, data) VALUES (?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET data=excluded.data""",
            (summary_id, username, json.dumps(data, ensure_ascii=False)),
        )

def save_plan(plan_id: str, data: dict, username: str):
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO plans (id, username, data) VALUES (?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET data=excluded.data""",
            (plan_id, username, json.dumps(data, ensure_ascii=False)),
        )

def delete_item(table: str, item_id: str):
    table_map = {"chat": "chats", "summary": "summaries", "planner": "plans"}
    tbl = table_map.get(table)
    if not tbl:
        return
    with get_conn() as conn:
        conn.execute(f"DELETE FROM {tbl} WHERE id=?", (item_id,))

def load_user_chats(username: str) -> dict:
    with get_conn() as conn:
        rows = conn.execute("SELECT id, messages FROM chats WHERE username=?", (username,)).fetchall()
    return {r["id"]: json.loads(r["messages"]) for r in rows}

def load_user_summaries(username: str) -> dict:
    with get_conn() as conn:
        rows = conn.execute("SELECT id, data FROM summaries WHERE username=?", (username,)).fetchall()
    return {r["id"]: json.loads(r["data"]) for r in rows}

def load_user_plans(username: str) -> dict:
    with get_conn() as conn:
        rows = conn.execute("SELECT id, data FROM plans WHERE username=?", (username,)).fetchall()
    return {r["id"]: json.loads(r["data"]) for r in rows}

def get_user(username: str) -> dict | None:
    with get_conn() as conn:
        row = conn.execute("SELECT username, email, password FROM users WHERE username=?", (username,)).fetchone()
    if not row:
        return None
    return {"username": row["username"], "email": row["email"], "password": row["password"]}

def get_user_by_email(email: str) -> dict | None:
    with get_conn() as conn:
        row = conn.execute("SELECT username, email, password FROM users WHERE email=?", (email,)).fetchone()
    if not row:
        return None
    return {"username": row["username"], "email": row["email"], "password": row["password"]}

def create_user(username: str, email: str, password_hash: str):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, password_hash),
        )

def update_user_password(username: str, password_hash: str):
    with get_conn() as conn:
        conn.execute("UPDATE users SET password=? WHERE username=?", (password_hash, username))
