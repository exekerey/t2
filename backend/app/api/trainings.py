from datetime import datetime
from typing import Optional
from uuid import UUID
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.deps import get_db, get_current_active_hr_user
from app.schemas.enums import TrainingRequestStatus, AttendanceStatus

router = APIRouter()

@router.post("/", response_model=schemas.Training, dependencies=[Depends(get_current_active_hr_user)])
def create_training(*, db: Session = Depends(get_db), training_in: schemas.TrainingCreate) -> Any:
    """
    Create new training (HR only).
    """
    if training_in.date_start > training_in.date_end:
        raise HTTPException(status_code=400,detail ="date_start must be <= date_end")
    if training_in.capacity is not None and training_in.capacity <=0:
        raise HTTPException(status_code=400,detail="capacity must be >0")
    if training_in.price_amount <0:
        raise HTTPException(status_code = 400,detail="price_amount must be >=0")
    training = crud.training.create(db=db, obj_in=training_in)
    return training

@router.get("/", response_model=List[schemas.Training])
def read_trainings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,

    type: Optional[str] = None,
    city: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    supplier_id: Optional[UUID] = None,
) -> Any:
    """
    Retrieve trainings (TZ filters).
    """
    trainings = crud.training.get_multi_filtered(
        db,
        skip=skip,
        limit=limit,
        type=type,
        city=city,
        date_from=date_from,
        date_to=date_to,
        supplier_id=supplier_id,
    )
    return trainings

@router.get("/{id}", response_model=schemas.Training)
def read_training(*, db: Session = Depends(get_db), id: str) -> Any:
    """
    Get training by ID.
    """
    training = crud.training.get(db=db, id=id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")
    return training

@router.put("/{id}", response_model=schemas.Training, dependencies=[Depends(get_current_active_hr_user)])
def update_training(*, db: Session = Depends(get_db), id: str, training_in: schemas.TrainingUpdate) -> Any:
    """
    Update a training (HR only).
    """
    training = crud.training.get(db=db, id=id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")
    if training_in.date_start > training_in.date_end:
        raise HTTPException(status_code=400, detail="date_start must be <= date_end")
    if training_in.capacity is not None and training_in.capacity <= 0:
        raise HTTPException(status_code=400, detail="capacity must be > 0")
    if training_in.price_amount < 0:
        raise HTTPException(status_code=400, detail="price_amount must be >= 0")
    training = crud.training.update(db=db, db_obj=training, obj_in=training_in)
    return training

@router.get("/{id}/participants", response_model=List[schemas.TrainingRequestParticipant], dependencies=[Depends(get_current_active_hr_user)])
def read_training_participants(*, db: Session = Depends(get_db), id: UUID) -> Any:
    """
    Get participants of a training (HR only). Only from APPROVED requests.
    """
    training = crud.training.get(db=db, id=str(id))
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    participants = crud.training_request_participant.get_training_participants(db=db, training_id=id)
    return participants

@router.put(
    "/requests/{request_id}/participants/{participant_id}/attendance",
    response_model=schemas.TrainingRequestParticipant,
    dependencies=[Depends(get_current_active_hr_user)],
)
def update_participant_attendance(
    *,
    db: Session = Depends(get_db),
    request_id: UUID,
    participant_id: UUID,
    participant_in: schemas.TrainingRequestParticipantUpdate,
) -> Any:
    """
    Update attendance for participant (HR only).
    Allowed only if request is APPROVED and training is finished.
    """
    req = crud.training_request.get(db=db, id=str(request_id))
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status != TrainingRequestStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Attendance allowed only for approved requests")

    # training must be finished
    training = crud.training.get(db=db, id=str(req.training_id))
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    # training.date_end is DateTime (naive). Compare with utcnow() naive.
    if training.date_end >= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Training is not finished yet")

    participant = crud.training_request_participant.get_by_id(db=db, participant_id=participant_id)
    if not participant or participant.request_id != request_id:
        raise HTTPException(status_code=404, detail="Participant not found in this request")

    # we update only attendance here
    if participant_in.attendance is None:
        raise HTTPException(status_code=400, detail="attendance is required")

    participant.attendance = participant_in.attendance
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant

@router.put(
    "/participants/{participant_id}/certificate/number",
    response_model=schemas.TrainingRequestParticipant,
    dependencies=[Depends(get_current_active_hr_user)],
)
def update_participant_certificate_number(
    *,
    db: Session = Depends(get_db),
    participant_id: UUID,
    participant_in: schemas.TrainingRequestParticipantUpdate,
) -> Any:
    """
    Update certificate number (HR only).
    Allowed only if attendance == PRESENT.
    """
    participant = crud.training_request_participant.get_by_id(db=db, participant_id=participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    if participant.attendance != AttendanceStatus.PRESENT:
        raise HTTPException(status_code=400, detail="Certificate can be assigned only if attendance is PRESENT")

    if not participant_in.certificate_number:
        raise HTTPException(status_code=400, detail="certificate_number is required")

    participant.certificate_number = participant_in.certificate_number
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant