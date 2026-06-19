import json
from app.src.database import supabase
from app.src.shared.cache import Cache
from app.src.logs.schemas import LogCreate
from app.src.shared.exceptions import LogNotFoundException, LogInsertionException

class LogService:
    @staticmethod
    async def create_log(log_data: LogCreate):
        result = supabase.table("logs").insert(log_data.model_dump()).execute()
        if not result.data:
            raise LogInsertionException("Failed to insert log")

        log = result.data[0]
        await Cache.forget("logs:service::level:")
        cache_key = f"logs:service:{log.get('service')}:level:{log.get('level')}"
        await Cache.forget(cache_key)
        return log

    @staticmethod
    async def list_logs(service: str = None, level: str = None):
        cache_key = f"logs:service:{service}:level:{level}"
        cached_data = await Cache.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        limit = 100
        query = (
            supabase.table("logs").select("*").order("created_at", desc=True).limit(limit)
        )

        if service:
            query = query.eq("service", service)
        if level:
            query = query.eq("level", level)

        result = query.execute()
        await Cache.set(cache_key, json.dumps(result.data), expire_seconds=60)
        return result.data

    @staticmethod
    async def get_log(log_id: str):
        cached_data = await Cache.get(f"log:{log_id}")
        if cached_data:
            return json.loads(cached_data)

        response = (
            supabase.table("logs").select("*").eq("id", log_id).single().execute()
        )
        
        await Cache.set(f"log:{log_id}", json.dumps(response.data), expire_seconds=60)
        return response.data
    
    @staticmethod
    async def delete_log(log_id: str):
        response = (
            supabase.table("logs").select("*").eq("id", log_id).single().execute()
        )
        log = response.data
        supabase.table("logs").delete().eq("id", log.get("id")).execute()
        await Cache.forget("logs:service::level:")
        await Cache.forget(f"logs:service:{log.get('service')}:level:{log.get('level')}")
        await Cache.forget(f"log:{log.get('id')}")
        return True
