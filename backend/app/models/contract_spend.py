import uuid
from datetime import datetime
from sqlalchemy import Column, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class ContractSpend(Base):
    __tablename__ = "contract_spends"
    amount = Column(Numeric, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=False)
    request_id = Column(UUID(as_uuid=True), ForeignKey("training_requests.id"), nullable=False)

    contract = relationship("Contract", back_populates="spends")
    request = relationship("TrainingRequest", back_populates="spends")
