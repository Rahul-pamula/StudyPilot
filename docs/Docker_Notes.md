# Docker Deployment Notes

StudyPilot uses a multi-container Docker architecture via `docker-compose.yml`.

## Architecture

The application is split into two primary services:

1. **`api` (Backend)**
   - **Image:** `python:3.10-slim`
   - **Framework:** FastAPI
   - **Port:** `8000`
   - **Volume Mounts:** `./backend/studypilot.db:/app/studypilot.db` (ensures database persistence).
   - **Pre-Caching:** The Dockerfile automatically downloads large ML models (NLTK lexicons and Hugging Face T5 weights) during the build stage so the container boots fast.

2. **`frontend` (Frontend UI)**
   - **Image:** `node:20-alpine` (Multi-stage build)
   - **Framework:** Next.js (App Router)
   - **Port:** `3000`
   - **Build Optimization:** Uses Next.js `standalone` output mode to dramatically reduce the final image size.

## Useful Docker Commands

### Start the Application
To build the images and start the containers in detached mode:
```bash
docker compose up --build -d
```
*Note: The initial build might take a few minutes as it downloads PyTorch and caches the ML models.*

### Stop the Application
```bash
docker compose down
```
*To remove orphan containers (if you changed service names):*
```bash
docker compose down --remove-orphans
```

### View Logs
To view logs for both services in real-time:
```bash
docker compose logs -f
```
To view logs for just the API or Frontend:
```bash
docker compose logs -f api
docker compose logs -f frontend
```

### Rebuild a Specific Service
If you make changes to the frontend code and want to restart just that container without touching the backend:
```bash
docker compose up -d --build frontend
```

### Accessing the App
* **Frontend UI:** [http://localhost:3000](http://localhost:3000)
* **Backend API (Swagger Docs):** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend API (Redoc):** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Troubleshooting

- **Port in Use Error:** If you get a `bind: address already in use` error for port 3000 or 8000, ensure you aren't running `npm run dev` or `uvicorn` locally outside of Docker. Kill the local processes first.
- **Database Missing Data:** Ensure the volume mount in `docker-compose.yml` (`./backend/studypilot.db:/app/studypilot.db`) is correct and the local file exists. 
