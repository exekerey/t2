"""Seed basic departments for cold start

Revision ID: 1b2c3d4e5f6g
Revises: 0a7a3fbb1c0d
Create Date: 2026-03-02 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime
import uuid


# revision identifiers, used by Alembic.
revision = '1b2c3d4e5f6g'
down_revision = '0a7a3fbb1c0d'
branch_labels = None
depends_on = None

# Basic departments for cold start
DEPARTMENTS = [
    "Human Resources",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
]


def upgrade():
    departments_table = sa.table(
        'departments',
        sa.column('id', sa.UUID),
        sa.column('name', sa.String),
        sa.column('created_at', sa.DateTime),
        sa.column('updated_at', sa.DateTime),
    )

    now = datetime.utcnow()

    op.bulk_insert(
        departments_table,
        [
            {
                'id': uuid.uuid4(),
                'name': name,
                'created_at': now,
                'updated_at': now,
            }
            for name in DEPARTMENTS
        ]
    )


def downgrade():
    departments_table = sa.table('departments', sa.column('name', sa.String))

    op.execute(
        departments_table.delete().where(
            departments_table.c.name.in_(DEPARTMENTS)
        )
    )
