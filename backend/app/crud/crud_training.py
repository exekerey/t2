from app.crud.base import CRUDBase
from app.models.training import Training
from app.schemas.training import TrainingCreate, TrainingUpdate

class CRUDTraining(CRUDBase[Training, TrainingCreate, TrainingUpdate]):
    pass

training = CRUDTraining(Training)
