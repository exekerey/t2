from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.base_class import TimestampedBase

class Department(TimestampedBase):
    __tablename__ = "departments"
    name = Column(String, nullable=False, unique=True)
    employees = relationship("Employee", back_populates="department")
