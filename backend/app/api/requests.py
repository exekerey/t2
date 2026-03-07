from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.deps import (
    get_db,
    get_current_active_user,
    get_current_active_hr_or_manager_user,
    get_current_active_hr_user,
)
from app.schemas.training_request import (
    TrainingRequestCreate,
    TrainingRequest,
    TrainingRequestApprove,
    TrainingRequestReject,
)

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post(
    "/",
    response_model=TrainingRequest,
    summary="Create draft training request (Manager)",
)
def create_request(
    request_in: schemas.TrainingRequestCreate,
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_active_hr_or_manager_user),
):
    return crud.training_request.create_with_manager(
        db, obj_in=request_in, manager_id=current_user.id
    )


@router.get(
    "/",
    response_model=List[TrainingRequest],
    summary="List requests: inbox for HR, my requests for Manager",
)
def get_requests(
    scope: str = Query("mine", regex="^(inbox|mine)$"),
    status: Optional[schemas.TrainingRequestStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_active_user),
):
    if current_user.role == schemas.enums.EmployeeRole.HR:
        if scope == "inbox":
            requests = crud.training_request.get_inbox(db, status=status, skip=skip, limit=limit)
        else:
            requests = crud.training_request.get_multi_with_filter(db, status=status, skip=skip, limit=limit)
    elif current_user.role == schemas.enums.EmployeeRole.MANAGER:
        if scope != "mine":
            raise HTTPException(403, "Managers can only see their own requests")
        requests = crud.training_request.get_multi_by_manager(
            db, manager_id=current_user.id, status=status, skip=skip, limit=limit
        )
    else:
        raise HTTPException(403, "Not allowed")

    return requests


@router.get(
    "/{request_id}",
    response_model=TrainingRequest,
    summary="Get single request detail",
)
def get_request(
    request_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_active_user),
):
    request = crud.training_request.get(db, id=request_id)
    if not request:
        raise HTTPException(404, "Request not found")

    # Simple viewing authorization
    if (
        current_user.role == schemas.enums.EmployeeRole.EMPLOYEE
        or (
            current_user.role == schemas.enums.EmployeeRole.MANAGER
            and request.manager_id != current_user.id
        )
    ):
        raise HTTPException(403, "Not allowed to view this request")

    return request


@router.post(
    "/{request_id}/approve",
    response_model=TrainingRequest,
    summary="Approve request + spend budget (HR only)",
)
def approve_request(
    request_id: UUID,
    approve_in: TrainingRequestApprove,
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_active_hr_user),
):
    return crud.training_request.approve(
        db,
        request_id=request_id,
        approve_in=approve_in,
        current_hr_id=current_user.id,
    )


@router.post(
    "/{request_id}/reject",
    response_model=TrainingRequest,
    summary="Reject request (HR only)",
)
def reject_request(
    request_id: UUID,
    reject_in: TrainingRequestReject,
    db: Session = Depends(get_db),
    current_user: models.Employee = Depends(get_current_active_hr_user),
):
    return crud.training_request.reject(
        db,
        request_id=request_id,
        reject_in=reject_in,
        current_hr_id=current_user.id,
    )

