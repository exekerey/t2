from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.deps import get_db, get_current_active_hr_user

router = APIRouter()


@router.get("/", response_model=List[schemas.Department])
def read_departments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve departments.
    """
    departments = crud.department.get_multi(db, skip=skip, limit=limit)
    return departments


@router.post("/", response_model=schemas.Department)
def create_department(
    *,
    db: Session = Depends(get_db),
    department_in: schemas.DepartmentCreate,
    current_user: models.Employee = Depends(get_current_active_hr_user),
) -> Any:
    """
    Create new department.
    """
    department = crud.department.get_by_name(db, name=department_in.name)
    if department:
        raise HTTPException(
            status_code=400,
            detail="The department with this name already exists in the system.",
        )
    department = crud.department.create(db, obj_in=department_in)
    return department
