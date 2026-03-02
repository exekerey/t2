from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import security
from app.core.config import settings
from app.deps import get_current_active_user, get_db

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = crud.employee.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=schemas.Employee)
def register(
    *,
    db: Session = Depends(get_db),
    employee_in: schemas.EmployeeCreate,
) -> Any:
    """
    Create new user.
    """
    user = crud.employee.get_by_email(db, email=employee_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    # Department is required for EMPLOYEE and MANAGER roles
    if employee_in.role in [schemas.EmployeeRole.EMPLOYEE, schemas.EmployeeRole.MANAGER]:
        if employee_in.department_id is None:
            raise HTTPException(
                status_code=400,
                detail="Department ID is required for Employee and Manager roles.",
            )

    if employee_in.department_id is not None:
        department = crud.department.get(db, id=employee_in.department_id)
        if not department:
            raise HTTPException(
                status_code=400,
                detail="Department with this id does not exist.",
            )

    try:
        user = crud.employee.create(db, obj_in=employee_in)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Invalid employee data or database constraints violation.",
        )

    return user


@router.get("/me", response_model=schemas.Employee)
def read_user_me(
    current_user: models.Employee = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
