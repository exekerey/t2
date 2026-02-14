from fastapi import APIRouter

from app.api import (
    auth,
    suppliers,
    contracts,
    trainings,
    employees,
    departments,
    requests,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
api_router.include_router(trainings.router, prefix="/trainings", tags=["trainings"])
api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
