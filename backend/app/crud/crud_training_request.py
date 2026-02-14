from app.crud.base import CRUDBase
from app.models.training_request import TrainingRequest
from app.schemas.training_request import TrainingRequestCreate, TrainingRequestUpdate

class CRUDTrainingRequest(CRUDBase[TrainingRequest, TrainingRequestCreate, TrainingRequestUpdate]):
    # You can add custom logic here for creating requests, calculating costs, etc.
    pass

training_request = CRUDTrainingRequest(TrainingRequest)
