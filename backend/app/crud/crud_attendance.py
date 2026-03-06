from uuid import UUID
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.training_request import TrainingRequest
from app.models.training_request_participant import TrainingRequestParticipant
from app.models.training import Training
from app.schemas.enums import TrainingRequestStatus, AttendanceStatus
from app.schemas.attendance import AttendanceUpdate, CertificateNumberUpdate, ParticipantOut


def _to_out(p: TrainingRequestParticipant) -> ParticipantOut:
    return ParticipantOut(
        id=p.id,
        request_id=p.request_id,
        employee_id=p.employee_id,
        employee_full_name=p.employee.full_name,
        employee_email=p.employee.email,
        attendance=p.attendance,
        certificate_number=p.certificate_number,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


def get_training_participants(db: Session, training_id: UUID) -> list[ParticipantOut]:
    training = db.get(Training, training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    participants = (
        db.query(TrainingRequestParticipant)
        .join(TrainingRequest, TrainingRequestParticipant.request_id == TrainingRequest.id)
        .filter(
            TrainingRequest.training_id == training_id,
            TrainingRequest.status == TrainingRequestStatus.APPROVED,
        )
        .all()
    )

    return [_to_out(p) for p in participants]


def update_attendance(
    db: Session,
    request_id: UUID,
    participant_id: UUID,
    body: AttendanceUpdate,
) -> ParticipantOut:
    participant = db.get(TrainingRequestParticipant, participant_id)

    if not participant or participant.request_id != request_id:
        raise HTTPException(status_code=404, detail="Participant not found in this request")

    request = db.get(TrainingRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.status != TrainingRequestStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Request must be approved first")

    training = db.get(Training, request.training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    today = datetime.now(timezone.utc).replace(tzinfo=None)
    if training.date_end >= today:
        raise HTTPException(
            status_code=400,
            detail="Attendance can only be set after the training has ended",
        )

    participant.attendance = body.attendance
    db.commit()
    db.refresh(participant)

    return _to_out(participant)


def update_certificate_number(
    db: Session,
    participant_id: UUID,
    body: CertificateNumberUpdate,
) -> ParticipantOut:
    participant = db.get(TrainingRequestParticipant, participant_id)

    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    if participant.attendance != AttendanceStatus.PRESENT:
        raise HTTPException(
            status_code=400,
            detail="Certificate can only be issued to participants marked as present",
        )

    participant.certificate_number = body.certificate_number
    db.commit()
    db.refresh(participant)

    return _to_out(participant)