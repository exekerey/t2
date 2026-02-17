from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.deps import get_db, get_current_active_hr_user
import uuid

router = APIRouter()

@router.post("/", response_model=schemas.Contract, dependencies=[Depends(get_current_active_hr_user)])
def create_contract(*, db: Session = Depends(get_db), contract_in: schemas.ContractCreate) -> Any:
    """
    Create new contract (HR only).
    """
    contract = crud.contract.create(db=db, obj_in=contract_in)
    return contract

@router.get("/", response_model=List[schemas.Contract])
def read_contracts(
    db: Session = Depends(get_db),
    status: schemas.enums.ContractStatus = None,
    supplier_id: uuid.UUID = None,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve contracts, filtered by status or supplier.
    """
    contracts = crud.contract.get_multi_filtered(db, status=status, supplier_id=supplier_id, skip=skip, limit=limit)
    return contracts

@router.get("/{id}", response_model=schemas.Contract)
def read_contract(*, db: Session = Depends(get_db), id: str) -> Any:
    """
    Get contract by ID.
    """
    contract = crud.contract.get(db=db, id=id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@router.put("/{id}", response_model=schemas.Contract, dependencies=[Depends(get_current_active_hr_user)])
def update_contract(*, db: Session = Depends(get_db), id: str, contract_in: schemas.ContractUpdate) -> Any:
    """
    Update a contract (HR only).
    """
    contract = crud.contract.get(db=db, id=id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    contract = crud.contract.update(db=db, db_obj=contract, obj_in=contract_in)
    return contract
