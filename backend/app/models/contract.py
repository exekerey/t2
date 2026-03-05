import uuid
from sqlalchemy import Column, String, Date, Numeric, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import TimestampedBase
from app.schemas.enums import ContractStatus

class Contract(TimestampedBase):
    __tablename__ = "contracts"
    number = Column(String, nullable=False)
    date_start = Column(Date, nullable=False)
    date_end = Column(Date, nullable=False)
    budget_limit = Column(Numeric, nullable=False)
    status = Column(Enum(ContractStatus), nullable=False)
    
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=False)
    supplier = relationship("Supplier", back_populates="contracts")

    spends = relationship("ContractSpend", back_populates="contract", cascade="all, delete-orphan")
    training_requests = relationship("TrainingRequest", back_populates="contract", cascade="all, delete-orphan")

    __table_args__ = (UniqueConstraint('number', 'supplier_id', name='_supplier_contract_number_uc'),)
