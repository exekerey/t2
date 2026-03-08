from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.training_request_participant import TrainingRequestParticipant
from app.models.training_request import TrainingRequest
from app.schemas.enums import TrainingRequestStatus


class CRUDTrainingRequestParticipant:
    def get_by_id(self, db: Session, *, participant_id: UUID) -> Optional[TrainingRequestParticipant]:
        return (
            db.query(TrainingRequestParticipant)
            .filter(TrainingRequestParticipant.id == participant_id)
            .first()
        )

    def get_training_participants(self, db: Session, *, training_id: UUID) -> List[TrainingRequestParticipant]:
        return (
            db.query(TrainingRequestParticipant)
            .join(TrainingRequest, TrainingRequestParticipant.request_id == TrainingRequest.id)
            .filter(
                TrainingRequest.training_id == training_id,
                TrainingRequest.status == TrainingRequestStatus.APPROVED,
            )
            .all()
        )


training_request_participant = CRUDTrainingRequestParticipant()