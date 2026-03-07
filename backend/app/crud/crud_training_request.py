from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.crud.base import CRUDBase
from app.models.training_request import TrainingRequest
from app.models.training_request_participant import TrainingRequestParticipant
from app.models.contract_spend import ContractSpend
from app.models.training import Training
from app.models.contract import Contract
from app.schemas.training_request import (
    TrainingRequestCreate,
    TrainingRequestApprove,
    TrainingRequestReject,
)
from app.schemas.enums import TrainingRequestStatus, TrainingPricingModel, ContractStatus


class CRUDTrainingRequest(CRUDBase[TrainingRequest, TrainingRequestCreate, dict]):
    def create_with_manager(
        self,
        db: Session,
        *,
        obj_in: TrainingRequestCreate,
        manager_id: UUID,
    ) -> TrainingRequest:
        # Create request with SUBMITTED status (cost calculated on approve)
        db_obj = TrainingRequest(
            training_id=obj_in.training_id,
            manager_id=manager_id,
            status=TrainingRequestStatus.SUBMITTED,
            cost_amount=0,
            submitted_at=func.now(),
        )
        db.add(db_obj)
        db.flush()  # получаем id

        # Adding participants
        for emp_id in obj_in.participant_ids:
            participant = TrainingRequestParticipant(
                request_id=db_obj.id,
                employee_id=emp_id,
            )
            db.add(participant)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def calculate_cost(self, db: Session, request: TrainingRequest) -> float:
        training = db.query(Training).get(request.training_id)
        if not training:
            raise HTTPException(404, "Training not found")

        count = request.participant_count

        if training.pricing_model == TrainingPricingModel.PER_PERSON:
            return float(training.price_amount) * count
        else:  # PER_GROUP
            return float(training.price_amount)  # fixed amount for the entire group

    def approve(
        self,
        db: Session,
        *,
        request_id: UUID,
        approve_in: TrainingRequestApprove,
        current_hr_id: UUID,
    ) -> TrainingRequest:
        request = (
            db.query(self.model)
            .filter(self.model.id == request_id)
            .options(joinedload(self.model.participants))
            .first()
        )
        if not request:
            raise HTTPException(404, "Request not found")

        if request.status != TrainingRequestStatus.SUBMITTED:
            raise HTTPException(400, "Can only approve submitted requests")

        contract = db.query(Contract).get(approve_in.contract_id)
        if not contract:
            raise HTTPException(404, "Contract not found")

        if contract.status != ContractStatus.ACTIVE:
            raise HTTPException(400, "Contract is not active")

        # Calculating the cost
        cost = self.calculate_cost(db, request)

        # Checking the budget balance
        spent = (
            db.query(func.sum(ContractSpend.amount))
            .filter(ContractSpend.contract_id == contract.id)
            .scalar()
            or 0
        )
        remaining = float(contract.budget_limit) - float(spent)

        if remaining < cost:
            raise HTTPException(400, "Not enough budget on selected contract")

        spend = ContractSpend(
            contract_id=contract.id,
            request_id=request.id,
            amount=cost,
        )
        db.add(spend)

        # Updating the application
        request.contract_id = contract.id
        request.cost_amount = cost
        request.status = TrainingRequestStatus.APPROVED
        request.decided_at = func.now()

        db.commit()
        db.refresh(request)
        return request

    def reject(
        self,
        db: Session,
        *,
        request_id: UUID,
        reject_in: TrainingRequestReject,
        current_hr_id: UUID,
    ) -> TrainingRequest:
        request = db.query(TrainingRequest).get(request_id)
        if not request:
            raise HTTPException(404, "Request not found")

        if request.status != TrainingRequestStatus.SUBMITTED:
            raise HTTPException(400, "Can only reject submitted requests")

        request.status = TrainingRequestStatus.REJECTED
        request.reject_reason = reject_in.reject_reason
        request.decided_at = func.now()

        db.commit()
        db.refresh(request)
        return request

    def get_multi_by_manager(
        self,
        db: Session,
        *,
        manager_id: UUID,
        status: Optional[TrainingRequestStatus] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TrainingRequest]:
        query = db.query(self.model).filter(self.model.manager_id == manager_id)
        if status:
            query = query.filter(self.model.status == status)
        return query.offset(skip).limit(limit).all()

    def get_inbox(
        self,
        db: Session,
        *,
        status: Optional[TrainingRequestStatus] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TrainingRequest]:
        """For HR - submitted applications only"""
        query = db.query(self.model).filter(self.model.status == TrainingRequestStatus.SUBMITTED)
        if status:
            query = query.filter(self.model.status == status)
        return query.offset(skip).limit(limit).all()

    def get_multi_with_filter(
        self,
        db: Session,
        *,
        status: Optional[TrainingRequestStatus] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TrainingRequest]:
        query = db.query(self.model)
        if status:
            query = query.filter(self.model.status == status)
        return query.offset(skip).limit(limit).all()


training_request = CRUDTrainingRequest(TrainingRequest)