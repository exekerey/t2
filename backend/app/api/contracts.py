from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app import crud, models, schemas
from app.deps import get_db, get_current_active_hr_user
import uuid

router = APIRouter()


def _enrich_contract(contract: models.Contract) -> dict:
    """Add computed fields to contract response."""
    spent_amount = float(sum(float(s.amount) for s in contract.spends))
    budget_limit = float(contract.budget_limit)
    remaining_amount = budget_limit - spent_amount
    utilization_pct = (spent_amount / budget_limit * 100) if budget_limit > 0 else 0.0

    spends_data = [
        {
            "id": s.id,
            "amount": float(s.amount),
            "created_at": s.created_at,
            "request_id": s.request_id,
            "training_id": s.request.training_id if s.request else None,
        }
        for s in contract.spends
    ]

    return {
        "id": contract.id,
        "number": contract.number,
        "date_start": contract.date_start,
        "date_end": contract.date_end,
        "budget_limit": budget_limit,
        "status": contract.status,
        "supplier_id": contract.supplier_id,
        "spent_amount": spent_amount,
        "remaining_amount": remaining_amount,
        "utilization_pct": round(utilization_pct, 2),
        "spends": spends_data,
    }


@router.post("/", response_model=schemas.Contract, dependencies=[Depends(get_current_active_hr_user)])
def create_contract(*, db: Session = Depends(get_db), contract_in: schemas.ContractCreate) -> Any:
    """
    Create new contract (HR only).
    """
    contract = crud.contract.create(db=db, obj_in=contract_in)
    db.refresh(contract)
    return _enrich_contract(contract)


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
    return [_enrich_contract(c) for c in contracts]


@router.get("/{id}", response_model=schemas.Contract)
def read_contract(*, db: Session = Depends(get_db), id: str) -> Any:
    """
    Get contract by ID with spend details.
    """
    contract = (
        db.query(models.Contract)
        .filter(models.Contract.id == id)
        .options(joinedload(models.Contract.spends).joinedload(models.ContractSpend.request))
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return _enrich_contract(contract)


@router.put("/{id}", response_model=schemas.Contract, dependencies=[Depends(get_current_active_hr_user)])
def update_contract(*, db: Session = Depends(get_db), id: str, contract_in: schemas.ContractUpdate) -> Any:
    """
    Update a contract (HR only).
    """
    contract = crud.contract.get(db=db, id=id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    contract = crud.contract.update(db=db, db_obj=contract, obj_in=contract_in)
    db.refresh(contract)
    return _enrich_contract(contract)
