from datetime import datetime
from typing import Optional
from uuid import UUID
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.deps import get_db, get_current_active_hr_user

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
