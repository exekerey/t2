from datetime import datetime
from typing import Optional,List
from sqlalchemy.orm import Session
from app.models.training import Training
from app.crud.base import CRUDBase
from app.schemas.training import TrainingCreate, TrainingUpdate

class CRUDTraining(CRUDBase[Training, TrainingCreate, TrainingUpdate]):
    def get_multi_filtered(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        type: Optional[str] = None,
        city: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime]= None,
        supplier_id: Optional[uuid.UUID] = None,
    ) -> List[Training]:
        query = db.query(self.model)

        if type:
            query = query.filter(self.model.type == type)
        
        if city:
            query = query.filter(self.model.location.ilike(f"%{city}%"))
       
        if supplier_id:
            query = query.filter(self.model.supplier_id == supplier_id)

        if date_from:
            query = query.filter(self.model.date_start >= date_from)

        if date_to:
            query = query.filter(self.model.date_end <=date_to)

        return query.offset(skip).limit(limit).all()

training = CRUDTraining(Training)
