from typing import Optional
import uuid
from datetime import date
from pydantic import BaseModel
from .enums import ContractStatus

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
    pass
