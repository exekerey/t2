from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db, get_current_active_hr_user

router = APIRouter()


@router.put(
    "/{participant_id}/certificate/number",
    response_model=schemas.TrainingRequestParticipant,
    summary="Update participant certificate number (HR only)",
)
def update_certificate_number(
    participant_id: UUID,
    certificate_in: schemas.CertificateNumberUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_hr_user),
):
    """
    Update certificate number for a participant (HR only).
    """
    participant = crud.training_request.update_certificate_number(
        db,
        participant_id=participant_id,
        certificate_number=certificate_in.certificate_number,
    )
    return participant
