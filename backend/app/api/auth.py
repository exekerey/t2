from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
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
    user = crud.employee.create(db, obj_in=employee_in)
    return user


@router.get("/me", response_model=schemas.Employee)
def read_user_me(
    current_user: models.Employee = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
