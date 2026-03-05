from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate

class CRUDSupplier(CRUDBase[Supplier, SupplierCreate, SupplierUpdate]):
    def get_by_bin(self, db: Session, *, bin: str) -> Optional[Supplier]:
        return db.query(Supplier).filter(Supplier.bin == bin).first()

supplier = CRUDSupplier(Supplier)
