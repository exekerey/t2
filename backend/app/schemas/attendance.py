from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.schemas.enums import AttendanceStatus


class AttendanceUpdate(BaseModel):
    attendance: AttendanceStatus


class CertificateNumberUpdate(BaseModel):
    certificate_number: str


class ParticipantOut(BaseModel):
    id: UUID
    request_id: UUID
    employee_id: UUID
    employee_full_name: str
    employee_email: str
    attendance: Optional[AttendanceStatus] = None
    certificate_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True