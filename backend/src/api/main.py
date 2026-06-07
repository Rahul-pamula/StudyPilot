from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import auth, chat, summarizer, planner
from src.database import init_db

app = FastAPI(title="StudyPilot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(auth.router,       prefix="/api/auth",       tags=["auth"])
app.include_router(chat.router,       prefix="/api/chats",      tags=["chat"])
app.include_router(summarizer.router, prefix="/api/summaries",  tags=["summarizer"])
app.include_router(planner.router,    prefix="/api/plans",      tags=["planner"])
