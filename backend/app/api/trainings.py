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
    training = crud.training.create(db=db, obj_in=training_in)
    return training

@router.get("/", response_model=List[schemas.Training])
def read_trainings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve trainings.
    """
    trainings = crud.training.get_multi(db, skip=skip, limit=limit)
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
    training = crud.training.update(db=db, db_obj=training, obj_in=training_in)
    return training
