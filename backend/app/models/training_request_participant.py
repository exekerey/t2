import uuid
from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import TimestampedBase
from app.schemas.enums import AttendanceStatus

class TrainingRequestParticipant(TimestampedBase):
    __tablename__ = "training_request_participants"
    attendance = Column(Enum(AttendanceStatus), nullable=True)
    certificate_number = Column(String, nullable=True)
    
    request_id = Column(UUID(as_uuid=True), ForeignKey("training_requests.id"), nullable=False)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)

    request = relationship("TrainingRequest", back_populates="participants")
    employee = relationship("Employee")
