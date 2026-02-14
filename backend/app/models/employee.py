import uuid
from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import TimestampedBase
from app.schemas.enums import EmployeeRole

class Employee(TimestampedBase):
    __tablename__ = "employees"
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(EmployeeRole), nullable=False)
    
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    department = relationship("Department", back_populates="employees")
    
    managed_requests = relationship("TrainingRequest", back_populates="manager")
