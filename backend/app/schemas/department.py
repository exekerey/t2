from typing import Optional
from pydantic import BaseModel

# Shared properties
class DepartmentBase(BaseModel):
    name: Optional[str] = None

# Properties to receive on creation
class DepartmentCreate(DepartmentBase):
    name: str

# Properties to receive on update
class DepartmentUpdate(DepartmentBase):
    pass

# Properties to return to client
class DepartmentInDB(DepartmentUpdate):
    id: str
    name: str

    class Config:
        orm_mode = True

class Department(DepartmentInDB):
    pass
