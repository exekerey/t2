import enum

class EmployeeRole(str, enum.Enum):
    HR = "HR"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"

class ContractStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CLOSED = "closed"

class TrainingType(str, enum.Enum):
    SEMINAR = "seminar"
    TRAINING = "training"
    CERTIFICATION = "certification"

class TrainingPricingModel(str, enum.Enum):
    PER_PERSON = "per_person"
    PER_GROUP = "per_group"

class TrainingRequestStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
