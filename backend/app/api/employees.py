from typing import Any, List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas
from app.deps import get_db, get_current_active_hr_or_manager_user
import uuid

router = APIRouter()

@router.get(
    "/",
    response_model=List[schemas.Employee],
    dependencies=[Depends(get_current_active_hr_or_manager_user)],
)
def read_employees(
    db: Session = Depends(get_db),
    department_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve employees. Can be filtered by department.
    Accessible by HR and Managers.
    """
    employees = crud.employee.get_multi_by_department(db, department_id=department_id, skip=skip, limit=limit)
    return employees
