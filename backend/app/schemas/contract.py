from typing import Optional, List
import uuid
from datetime import date, datetime
from pydantic import BaseModel, computed_field
from .enums import ContractStatus


# Spend history schema
class ContractSpendBase(BaseModel):
    id: uuid.UUID
    amount: float
    created_at: datetime
    request_id: uuid.UUID

    class Config:
        from_attributes = True


class ContractSpend(ContractSpendBase):
    """Spend with related request info"""
    training_id: Optional[uuid.UUID] = None
    training_title: Optional[str] = None


# Shared properties
class ContractBase(BaseModel):
    number: Optional[str] = None
    date_start: Optional[date] = None
    date_end: Optional[date] = None
    budget_limit: Optional[float] = None
    status: Optional[ContractStatus] = None
    supplier_id: Optional[uuid.UUID] = None


# Properties to receive on creation
class ContractCreate(ContractBase):
    number: str
    date_start: date
    date_end: date
    budget_limit: float
    status: ContractStatus
    supplier_id: uuid.UUID


# Properties to receive on update
class ContractUpdate(ContractBase):
    pass


# Properties to return to client
class ContractInDB(ContractBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class Contract(ContractInDB):
    spent_amount: float = 0.0
    remaining_amount: float = 0.0
    utilization_pct: float = 0.0
    spends: List[ContractSpend] = []
