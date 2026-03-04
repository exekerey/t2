from app.crud.crud_contract import contract
from app.crud.crud_department import department
from app.crud.crud_employee import employee
from app.crud.crud_supplier import supplier
from app.crud.crud_training import training
from app.crud.crud_training_request import training_request
from app.crud.crud_training_request_participant import training_request_participant

__all__ = [
    "contract",
    "department",
    "employee",
    "supplier",
    "training",
    "training_request",
    "training_request_participant",
]
