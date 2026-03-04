import uuid
from sqlalchemy import Column, String, DateTime, Numeric, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import TimestampedBase
from app.schemas.enums import TrainingRequestStatus

class TrainingRequest(TimestampedBase):
    __tablename__ = "training_requests"
    status = Column(Enum(TrainingRequestStatus), nullable=False, default=TrainingRequestStatus.SUBMITTED)
    reject_reason = Column(String, nullable=True)
    cost_amount = Column(Numeric, nullable=False, default=0)
    submitted_at = Column(DateTime, nullable=True)
    decided_at = Column(DateTime, nullable=True)

    training_id = Column(UUID(as_uuid=True), ForeignKey("trainings.id"), nullable=False)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=True)

    training = relationship("Training", back_populates="requests")
    manager = relationship("Employee", back_populates="managed_requests")
    contract = relationship("Contract", back_populates="training_requests")
    
    participants = relationship("TrainingRequestParticipant", back_populates="request")
    spends = relationship("ContractSpend", back_populates="request")

    @property
    def participant_count(self) -> int:
        return len(self.participants)