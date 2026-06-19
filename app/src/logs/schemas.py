from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class LogCreate(BaseModel):
    service: str = Field(..., example="chat-api")
    environment: str = Field(..., example="production")
    level: str = Field(..., example="ERROR")
    log_message: str
    trace_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class LogResponse(LogCreate):
    id: str
    created_at: str
