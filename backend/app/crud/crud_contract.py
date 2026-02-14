from app.crud.base import CRUDBase
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractUpdate

class CRUDContract(CRUDBase[Contract, ContractCreate, ContractUpdate]):
    pass

contract = CRUDContract(Contract)
