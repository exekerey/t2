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


class CertificateOut(BaseModel):
    """Certificate info for employee's own certificates view"""
    certificate_number: str
    training_id: UUID
    training_title: Optional[str] = None
    training_type: Optional[str] = None
    training_date_start: Optional[datetime] = None
    training_date_end: Optional[datetime] = None
    issued_at: datetime

    class Config:
        from_attributes = True