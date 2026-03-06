from sqlalchemy import Column, String, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import TimestampedBase

class Supplier(TimestampedBase):
    __tablename__ = "suppliers"
    name = Column(String, nullable=False)
    bin = Column(String, nullable=False, unique=True)
    contacts = Column(JSON)  # {email, phone_number, website}
    
    contracts = relationship("Contract", back_populates="supplier", cascade="all, delete-orphan")
    trainings = relationship("Training", back_populates="supplier", cascade="all, delete-orphan")
