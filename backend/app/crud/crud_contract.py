from typing import List, Optional
import uuid
from sqlalchemy.orm import Session, joinedload

from app.crud.base import CRUDBase
from app.models.contract import Contract
from app.models.contract_spend import ContractSpend
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
        limit: int = 100,
    ) -> List[Contract]:
        q = db.query(self.model).options(
            joinedload(self.model.spends).joinedload(ContractSpend.request)
        )

        if status is not None:
            q = q.filter(self.model.status == status)

        if supplier_id is not None:
            q = q.filter(self.model.supplier_id == supplier_id)

        return q.offset(skip).limit(limit).all()


contract = CRUDContract(Contract)
