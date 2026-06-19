from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from app.src.logs.schemas import LogCreate, LogResponse
from app.src.logs.service import LogService
from app.src.shared.rate_limiter import rate_limiter
from app.src.shared.exceptions import LogInsertionException

router = APIRouter(prefix="/v1/logs", tags=["logs"])


@router.post(
    "/",
    response_model=LogResponse,
)
@rate_limiter()
def create_log(request: Request, log: LogCreate):
    try:
        return LogService.create_log(log)
    except LogInsertionException as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/",
    response_model=List[LogResponse],
)
@rate_limiter()
def list_logs(
    request: Request, service: Optional[str] = None, level: Optional[str] = None
):
    return LogService.list_logs(service, level)


@router.get(
    "/{log_id}",
    response_model=LogResponse,
)
@rate_limiter()
def get_log(request: Request, log_id: str):
    try:
        return LogService.get_log(log_id)
    except Exception as e:
        # TODO: improve error handling
        if hasattr(e, "code") and e.code == "PGRST116":
            raise HTTPException(status_code=404, detail="Log not found")
        raise


@router.delete("/{log_id}")
def delete_log(log_id: str):
    LogService.delete_log(log_id)
    return {"status": "deleted"}
