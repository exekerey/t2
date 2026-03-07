from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, HttpUrl

# Shared properties
class SupplierBase(BaseModel):
    name: Optional[str] = None
    bin: Optional[str] = None

class SupplierContacts(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    website: Optional[HttpUrl] = None

# Properties to receive on creation
class SupplierCreate(SupplierBase):
    name: str
    bin: str
    contacts: SupplierContacts

# Properties to receive on update
class SupplierUpdate(SupplierBase):
    contacts: Optional[SupplierContacts] = None

# Properties to return to client
class SupplierInDB(SupplierUpdate):
    id: UUID

    class Config:
        from_attributes = True

class Supplier(SupplierInDB):
    pass