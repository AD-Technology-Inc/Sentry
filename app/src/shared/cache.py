import logging
from typing import Optional
from app.src.config import REDIS_HOST, REDIS_PORT
from redis.asyncio import Redis

logger = logging.getLogger(__name__)

redis = Redis(
    host=REDIS_HOST,
    port=int(REDIS_PORT),
    decode_responses=True,
    socket_connect_timeout=2,
    socket_timeout=2
)

class Cache:
    @staticmethod
    async def set(key: str, value: str, expire_seconds: int = 60):
        try:
            await redis.setex(key, expire_seconds, value)
        except Exception as e:
            logger.warning(f"Cache write error (Redis offline): {e}")

    @staticmethod
    async def get(key: str) -> Optional[str]:
        try:
            value = await redis.get(key)
            return value or None
        except Exception as e:
            logger.warning(f"Cache read error (Redis offline): {e}")
            return None

    @staticmethod
    async def has(key: str) -> bool:
        try:
            return bool(await redis.exists(key))
        except Exception as e:
            logger.warning(f"Cache check error (Redis offline): {e}")
            return False

    @staticmethod
    async def forget(key: str):
        try:
            await redis.delete(key)
        except Exception as e:
            logger.warning(f"Cache delete error (Redis offline): {e}")

