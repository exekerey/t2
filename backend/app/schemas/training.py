from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel
from .enums import TrainingType, TrainingPricingModel

# Shared properties
class TrainingBase(BaseModel):
    title: Optional[str] = None
    type: Optional[TrainingType] = None
    trainer_name: Optional[str] = None
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None
    location: Optional[str] = None
    pricing_model: Optional[TrainingPricingModel] = None
    price_amount: Optional[float] = None
    capacity: Optional[int] = None
    supplier_id: Optional[uuid.UUID] = None

# Properties to receive on creation
class TrainingCreate(TrainingBase):
    title: str
    type: TrainingType
    date_start: datetime
    date_end: datetime
    pricing_model: TrainingPricingModel
    price_amount: float
    supplier_id: uuid.UUID

# Properties to receive on update
class TrainingUpdate(TrainingBase):
    pass

# Properties to return to client
class TrainingInDB(TrainingBase):
    id: uuid.UUID
    
    class Config:
        from_attributes = True

class Training(TrainingInDB):
    pass
