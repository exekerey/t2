"""Seed initial users

Revision ID: 2c3d4e5f6h7i
Revises: 1b2c3d4e5f6g
Create Date: 2026-03-04 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM
from datetime import datetime
import uuid

from app.core.security import get_password_hash


# revision identifiers, used by Alembic.
revision = '2c3d4e5f6h7i'
down_revision = '1b2c3d4e5f6g'
branch_labels = None
depends_on = None

# Default password for all seed users
DEFAULT_PASSWORD = "password123"

# PostgreSQL enum type for employee role
EmployeeRoleEnum = ENUM('HR', 'MANAGER', 'EMPLOYEE', name='employeerole', create_type=False)

# Seed users with their roles and department associations
# Department names must match those in the departments seed migration
USERS = [
    {
        "email": "hr@example.com",
        "full_name": "HR User",
        "role": "HR",
        "department_name": "Human Resources",
    },
    {
        "email": "manager@example.com",
        "full_name": "Manager User",
        "role": "MANAGER",
        "department_name": "Engineering",
    },
    {
        "email": "employee@example.com",
        "full_name": "Employee User",
        "role": "EMPLOYEE",
        "department_name": "Engineering",
    },
]


def upgrade():
    departments_table = sa.table(
        'departments',
        sa.column('id', sa.UUID),
        sa.column('name', sa.String),
    )

    employees_table = sa.table(
        'employees',
        sa.column('id', sa.UUID),
        sa.column('full_name', sa.String),
        sa.column('email', sa.String),
        sa.column('hashed_password', sa.String),
        sa.column('role', EmployeeRoleEnum),
        sa.column('department_id', sa.UUID),
        sa.column('created_at', sa.DateTime),
        sa.column('updated_at', sa.DateTime),
    )

    conn = op.get_bind()

    # Get department IDs by name
    departments = conn.execute(
        sa.select(departments_table.c.id, departments_table.c.name)
    ).fetchall()

    department_map = {dept.name: dept.id for dept in departments}

    now = datetime.utcnow()
    hashed_password = get_password_hash(DEFAULT_PASSWORD)

    employees_data = []
    for user in USERS:
        department_id = department_map.get(user["department_name"])
        if department_id is None:
            raise ValueError(f"Department '{user['department_name']}' not found")

        employees_data.append({
            'id': uuid.uuid4(),
            'full_name': user['full_name'],
            'email': user['email'],
            'hashed_password': hashed_password,
            'role': user['role'],
            'department_id': department_id,
            'created_at': now,
            'updated_at': now,
        })

    op.bulk_insert(employees_table, employees_data)


def downgrade():
    employees_table = sa.table('employees', sa.column('email', sa.String))

    emails = [user['email'] for user in USERS]

    op.execute(
        employees_table.delete().where(
            employees_table.c.email.in_(emails)
        )
    )
