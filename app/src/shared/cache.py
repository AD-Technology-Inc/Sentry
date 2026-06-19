from typing import Optional
from app.src.config import REDIS_HOST, REDIS_PORT
from redis.asyncio import Redis

redis = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


class Cache:
    @staticmethod
    async def set(key: str, value: str, expire_seconds: int = 60):
        await redis.setex(key, expire_seconds, value)

    @staticmethod
    async def get(key: str) -> Optional[str]:
        value = await redis.get(key)
        return value or None

    @staticmethod
    async def has(key: str) -> bool:
        return bool(await redis.exists(key))

    @staticmethod
    async def forget(key: str):
        await redis.delete(key)
