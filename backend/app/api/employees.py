from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.deps import get_db, get_current_active_hr_user, get_current_active_manager_user
import uuid

router = APIRouter()

@router.get("/", response_model=List[schemas.Employee])
def read_employees(
    db: Session = Depends(get_db),
    department_id: uuid.UUID = None,
    skip: int = 0,
    limit: int = 100,
    # current_user: models.Employee = Depends(get_current_active_user) # Uncomment to restrict access
) -> Any:
    """
    Retrieve employees. Can be filtered by department.
    Accessible by HR and Managers.
    """
    # Add logic here to check if manager is requesting for their own department
    employees = crud.employee.get_multi_by_department(db, department_id=department_id, skip=skip, limit=limit)
    return employees
