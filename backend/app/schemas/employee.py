from typing import Optional
import uuid
from pydantic import BaseModel, EmailStr
from .enums import EmployeeRole

# Shared properties
class EmployeeBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[EmployeeRole] = None
    department_id: Optional[uuid.UUID] = None

# Properties to receive on creation
class EmployeeCreate(EmployeeBase):
    email: EmailStr
    password: str
    full_name: str
    role: EmployeeRole

# Properties to receive on update
class EmployeeUpdate(EmployeeBase):
    password: Optional[str] = None

# Properties to return to client
class EmployeeInDB(EmployeeBase):
    id: uuid.UUID
    
    class Config:
        orm_mode = True

class Employee(EmployeeInDB):
    pass
