from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.src.shared.rate_limiter import rate_limiter
from app.src.shared.cache import redis
from app.src.logs.router import router as logs_router
from app.src.issues.router import router as issues_router
from app.src.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB (creates PostgreSQL or SQLite tables if they do not exist)
    await init_db()
    yield

app = FastAPI(title="Centralized Logging Service", lifespan=lifespan)

# Add CORS Middleware to support frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs_router)
app.include_router(issues_router)


# --------------------
# Health Check
# --------------------
@app.get("/health")
async def health():
    return {"status": "ok", "redis": "connected"}


@app.get("/clear-redis")
async def clear_redis():
    try:
        if not await redis.ping():
            raise HTTPException(status_code=503, detail="Redis not reachable")
    except Exception:
        raise HTTPException(status_code=503, detail="Redis not reachable")

    await redis.flushdb()

    return {"status": "redis cleared", "redis": "connected"}


@app.get("/rate-limited")
@rate_limiter()
async def rate_limited(request: Request):
    return {"msg": "Hello World"}
