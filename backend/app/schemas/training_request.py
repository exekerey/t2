from typing import Optional, List
import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from .enums import TrainingRequestStatus, AttendanceStatus

# Participant Schemas
class TrainingRequestParticipantBase(BaseModel):
    employee_id: uuid.UUID

class TrainingRequestParticipantCreate(TrainingRequestParticipantBase):
    pass

class TrainingRequestParticipantUpdate(BaseModel):
    attendance: Optional[AttendanceStatus] = None
    certificate_number: Optional[str] = None

class TrainingRequestParticipant(TrainingRequestParticipantBase):
    id: uuid.UUID
    request_id: uuid.UUID
    attendance: Optional[AttendanceStatus] = None
    certificate_number: Optional[str] = None

    class Config:
        orm_mode = True


# Request Schemas
class TrainingRequestBase(BaseModel):
    training_id: Optional[uuid.UUID] = None
    manager_id: Optional[uuid.UUID] = None
    
class TrainingRequestCreate(TrainingRequestBase):
    training_id: uuid.UUID
    participant_ids: List[uuid.UUID]

class TrainingRequestSubmit(BaseModel):
    pass


class TrainingRequestApprove(BaseModel):
    contract_id: uuid.UUID


class TrainingRequestReject(BaseModel):
    reject_reason: str = Field(..., min_length=1, description="Reason is required on reject")

class TrainingRequestUpdate(BaseModel):
    status: Optional[TrainingRequestStatus] = None
    reject_reason: Optional[str] = None
    contract_id: Optional[uuid.UUID] = None

class TrainingRequest(TrainingRequestBase):
    id: uuid.UUID
    status: TrainingRequestStatus
    reject_reason: Optional[str] = None
    cost_amount: float
    submitted_at: Optional[datetime] = None
    decided_at: Optional[datetime] = None
    contract_id: Optional[uuid.UUID] = None
    participants: List[TrainingRequestParticipant] = []

    class Config:
        from_attributes = True