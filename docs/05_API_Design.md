# VOLUME V: API DESIGN

## 10. REST API Specification

### 10.1 Base Configuration

```yaml
Base URL: https://api.studypilot.app/v1
Version: 1.0.0
Authentication: Bearer JWT (Supabase)
Rate Limit: 100 requests per minute per user
```

### 10.2 Session Endpoints

#### POST /sessions/start
**Request:**
```json
{
  "intents": ["React Hooks", "Python APIs"],
  "estimated_duration_mins": 120
}
```
**Response (201):**
```json
{
  "session_id": "uuid",
  "started_at": "2026-06-07T10:00:00Z",
  "status": "active"
}
```

#### POST /sessions/verify
**Request:**
```json
{
  "session_id": "uuid",
  "user_response": "useState hook",
  "trigger_app": "YouTube"
}
```
**Response (200):**
```json
{
  "valid": true,
  "confidence": 0.95,
  "message": "Response matches intent 'React Hooks'"
}
```

#### POST /sessions/{id}/end
**Response (200):**
```json
{
  "session_summary": {
    "duration_mins": 95,
    "focus_score": 82,
    "context_switches": 12
  }
}
```

---

# VOLUME VI: DEPLOYMENT & OPERATIONS

## 11. Deployment Architecture

### 11.1 Environment Configuration

```bash
# .env.production (FastAPI)
DATABASE_URL=postgresql://user:pass@db.railway.app:5432/studypilot
GROQ_API_KEY=gsk_production_key_here
REDIS_URL=redis://default:pass@redis.railway.app:6379
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
