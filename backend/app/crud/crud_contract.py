from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractUpdate
from app.schemas.enums import ContractStatus

class CRUDContract(CRUDBase[Contract, ContractCreate, ContractUpdate]):
    def get_multi_filtered(
        self,
        db: Session,
        *,
        status: Optional[ContractStatus] = None,
        supplier_id: Optional[uuid.UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Contract]:
        query = db.query(self.model)
        if status:
            query = query.filter(Contract.status == status)
        if supplier_id:
            query = query.filter(Contract.supplier_id == supplier_id)
        return query.offset(skip).limit(limit).all()

contract = CRUDContract(Contract)
