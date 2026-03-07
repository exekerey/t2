from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_active_hr_user
from app.schemas.attendance import AttendanceUpdate, CertificateNumberUpdate, ParticipantOut
from app.crud import crud_attendance

router = APIRouter()


@router.get(
    "/trainings/{training_id}/participants",
    response_model=list[ParticipantOut],
    summary="List all participants of approved requests for a training (HR only)",
)
def list_training_participants(
    training_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_hr_user),
):
    return crud_attendance.get_training_participants(db, training_id)


@router.put(
    "/requests/{request_id}/participants/{participant_id}/attendance",
    response_model=ParticipantOut,
    summary="Set attendance for participant (HR only, after training ends)",
)
def set_attendance(
    request_id: UUID,
    participant_id: UUID,
    body: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_hr_user),
):
    return crud_attendance.update_attendance(db, request_id, participant_id, body)


@router.put(
    "/participants/{participant_id}/certificate/number",
    response_model=ParticipantOut,
    summary="Set certificate number for participant (HR only, attendance=present required)",
)
def set_certificate_number(
    participant_id: UUID,
    body: CertificateNumberUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_hr_user),
):
    return crud_attendance.update_certificate_number(db, participant_id, body)