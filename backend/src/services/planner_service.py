import random
import datetime
from src.config import MOTIVATIONAL_BANK, CHECKIN_MESSAGES
from src.ai_engines import get_sia
from src.database import save_plan, delete_item

# In-memory message history to prevent repetition: {msg: count}
_message_history: dict = {}

def get_motivational_message(sentiment_score: float) -> tuple[str, str, str]:
    cat  = "positive" if sentiment_score >= 0.1 else ("negative" if sentiment_score <= -0.1 else "neutral")
    opts = MOTIVATIONAL_BANK[cat]
    avail = [m for m in opts if _message_history.get(m, 0) < 2] or opts
    chosen = random.choice(avail)
    _message_history[chosen] = _message_history.get(chosen, 0) + 1
    return chosen, cat, CHECKIN_MESSAGES[cat]

def create_new_plan(username: str) -> tuple[str, dict]:
    nid = f"planner_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
    plan = {
        "subjects": "", "weak": "", "mood": "", "schedule": [],
        "title": "Untitled Plan", "deadlines": [], "study_logs": [],
        "active_session_idx": 0
    }
    save_plan(nid, plan, username)
    return nid, plan

def delete_plan(plan_id: str) -> None:
    delete_item("planner", plan_id)

def generate_schedule(
    plan_id: str,
    username: str,
    subj: str,
    weak: str,
    start_time_str: str,
    end_time_str: str,
    mood: str,
    existing_plan: dict
) -> tuple[str, dict]:
    """Returns ("OK", updated_plan_dict) or (error_message, {})."""
    slist = [s.strip() for s in subj.split(",") if s.strip()]
    if not slist:
        return "Please enter at least one subject.", {}

    start_time = datetime.time.fromisoformat(start_time_str)
    end_time   = datetime.time.fromisoformat(end_time_str)
    if end_time <= start_time:
        return "End time must be after start time.", {}

    sia        = get_sia()
    mood_score = sia.polarity_scores(mood)["compound"]
    boost, mood_cat, checkin = get_motivational_message(mood_score)

    plan = dict(existing_plan)
    plan.update({"subjects": subj, "weak": weak, "mood": mood, "active_session_idx": 0})
    if plan.get("title", "").startswith("Untitled") and slist:
        plan["title"] = f"Plan: {slist[0]}"

    start_dt      = datetime.datetime.combine(datetime.date.today(), start_time)
    end_dt        = datetime.datetime.combine(datetime.date.today(), end_time)
    total_minutes = int((end_dt - start_dt).total_seconds() / 60)

    if mood_score <= -0.3:
        work_mins, break_mins, mode = 20, 10, "gentle"
    elif mood_score <= -0.1:
        work_mins, break_mins, mode = 25, 10, "mellow"
    else:
        work_mins, break_mins, mode = 25, 5, "classic"

    weighted = []
    for s in slist:
        weighted.append(s)
        if s.lower() == weak.strip().lower():
            weighted.append(s)

    schedule, t, i, session_num = [], start_dt, 0, 1
    while t < end_dt:
        remaining = int((end_dt - t).total_seconds() / 60)
        if remaining < work_mins:
            break
        sub          = weighted[i % len(weighted)]
        actual_work  = min(work_mins, remaining)
        end_session  = t + datetime.timedelta(minutes=actual_work)
        actual_break = min(break_mins, int((end_dt - end_session).total_seconds() / 60))
        resume_at    = end_session + datetime.timedelta(minutes=actual_break)
        schedule.append({
            "session":   session_num,
            "start":     t.strftime("%I:%M %p"),
            "end":       end_session.strftime("%I:%M %p"),
            "subject":   sub,
            "is_weak":   sub.lower() == weak.strip().lower(),
            "break_len": actual_break,
            "resume":    resume_at.strftime("%I:%M %p"),
            "mode":      mode,
        })
        t = resume_at
        i += 1
        session_num += 1

    plan.update({
        "schedule": schedule, "boost": boost, "checkin": checkin,
        "mood_cat": mood_cat, "mode": mode, "total_minutes": total_minutes,
    })
    save_plan(plan_id, plan, username)
    return "OK", plan
