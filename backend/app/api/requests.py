from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.deps import get_db, get_current_active_user, get_current_active_manager_user, get_current_active_hr_user

router = APIRouter()

@router.post("/", response_model=schemas.TrainingRequest, dependencies=[Depends(get_current_active_manager_user)])
def create_training_request(
    *,
    db: Session = Depends(get_db),
    request_in: schemas.TrainingRequestCreate,
    current_user: models.Employee = Depends(get_current_active_manager_user),
) -> Any:
    """
    Create new training request (Manager only).
    """
    # Add logic to calculate cost based on training pricing model
    request = crud.training_request.create_with_manager(db=db, obj_in=request_in, manager_id=current_user.id)
    return request

@router.get("/", response_model=List[schemas.TrainingRequest])
def read_requests(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.Employee = Depends(get_current_active_user), # Needs to be defined
) -> Any:
    """
    Retrieve training requests.
    - HR sees all submitted requests.
    - Manager sees their own requests.
    """
    if current_user.role == schemas.enums.EmployeeRole.HR:
        requests = crud.training_request.get_multi(db, skip=skip, limit=limit) # Add filtering for HR
    elif current_user.role == schemas.enums.EmployeeRole.MANAGER:
        requests = crud.training_request.get_multi_by_manager(db, manager_id=current_user.id, skip=skip, limit=limit)
    else:
        requests = []
    return requests

@router.get("/{id}", response_model=schemas.TrainingRequest)
def read_request(*, db: Session = Depends(get_db), id: str) -> Any:
    """
    Get request by ID.
    """
    request = crud.training_request.get(db=db, id=id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    # Add logic to ensure only relevant people can see it
    return request

# ... Add approve, reject, etc. endpoints as per the spec
