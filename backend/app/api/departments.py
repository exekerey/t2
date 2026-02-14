from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db

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
