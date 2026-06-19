from fastapi import FastAPI, Request, HTTPException
from app.src.shared.rate_limiter import rate_limiter
from app.src.shared.cache import redis
from app.src.logs.router import router as logs_router

app = FastAPI(title="Centralized Logging Service")


app.include_router(logs_router)


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
