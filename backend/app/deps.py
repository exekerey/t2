from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core.config import settings
from app.db.session import SessionLocal
from app.core import security

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.Employee:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.employee.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_active_user(
    current_user: models.Employee = Depends(get_current_user),
) -> models.Employee:
    # if not crud.user.is_active(current_user): # Add this logic if you have an is_active flag
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_hr_user(
    current_user: models.Employee = Depends(get_current_active_user),
) -> models.Employee:
    if current_user.role != schemas.enums.EmployeeRole.HR:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user

def get_current_active_manager_user(
    current_user: models.Employee = Depends(get_current_active_user),
) -> models.Employee:
    if current_user.role != schemas.enums.EmployeeRole.MANAGER:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def get_current_active_hr_or_manager_user(
    current_user: models.Employee = Depends(get_current_active_user),
) -> models.Employee:
    if current_user.role not in (
        schemas.enums.EmployeeRole.HR,
        schemas.enums.EmployeeRole.MANAGER,
    ):
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user

