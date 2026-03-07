from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.deps import get_db, get_current_active_hr_user

router = APIRouter()

@router.post("/", response_model=schemas.Supplier, dependencies=[Depends(get_current_active_hr_user)])
def create_supplier(
    *,
    db: Session = Depends(get_db),
    supplier_in: schemas.SupplierCreate,
) -> Any:
    """
    Create new supplier (HR only).
    """
    supplier = crud.supplier.get_by_bin(db, bin=supplier_in.bin)
    if supplier:
        raise HTTPException(
            status_code=400,
            detail="A supplier with this BIN already exists.",
        )
    supplier = crud.supplier.create(db=db, obj_in=supplier_in)
    return supplier

@router.get("/", response_model=List[schemas.Supplier])
def read_suppliers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve suppliers.
    """
    suppliers = crud.supplier.get_multi(db, skip=skip, limit=limit)
    return suppliers

@router.get("/{id}", response_model=schemas.Supplier)
def read_supplier(
    *,
    db: Session = Depends(get_db),
    id: str,
) -> Any:
    """
    Get supplier by ID.
    """
    supplier = crud.supplier.get(db=db, id=id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.put("/{id}", response_model=schemas.Supplier, dependencies=[Depends(get_current_active_hr_user)])
def update_supplier(
    *,
    db: Session = Depends(get_db),
    id: str,
    supplier_in: schemas.SupplierUpdate,
) -> Any:
    """
    Update a supplier (HR only).
    """
    supplier = crud.supplier.get(db=db, id=id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    if supplier_in.bin and supplier_in.bin != supplier.bin:
        existing = crud.supplier.get_by_bin(db, bin=supplier_in.bin)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="A supplier with this BIN already exists.",
            )
    supplier = crud.supplier.update(db=db, db_obj=supplier, obj_in=supplier_in)
    return supplier

@router.delete("/{id}", response_model=schemas.Supplier, dependencies=[Depends(get_current_active_hr_user)])
def delete_supplier(
    *,
    db: Session = Depends(get_db),
    id: str,
) -> Any:
    """
    Delete a supplier (HR only).
    """
    supplier = crud.supplier.get(db=db, id=id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier = crud.supplier.remove(db=db, id=id)
    return supplier
