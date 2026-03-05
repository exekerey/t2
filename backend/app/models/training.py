import uuid
from sqlalchemy import Column, String, DateTime, Numeric, Enum, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import TimestampedBase
from app.schemas.enums import TrainingType, TrainingPricingModel

class Training(TimestampedBase):
    __tablename__ = "trainings"
    title = Column(String, nullable=False)
    type = Column(Enum(TrainingType), nullable=False)
    trainer_name = Column(String)
    date_start = Column(DateTime, nullable=False)
    date_end = Column(DateTime, nullable=False)
    location = Column(String)
    pricing_model = Column(Enum(TrainingPricingModel), nullable=False)
    price_amount = Column(Numeric, nullable=False)
    capacity = Column(Integer)
    
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=False)
    supplier = relationship("Supplier", back_populates="trainings")

    requests = relationship("TrainingRequest", back_populates="training", cascade="all, delete-orphan")