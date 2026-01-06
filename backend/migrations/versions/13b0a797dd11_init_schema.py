"""Initial schema

Revision ID: 13b0a797dd11
Revises: 
Create Date: 2026-01-06
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "13b0a797dd11"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    user_type_enum = postgresql.ENUM("admin", "staff", name="user_type_enum")
    user_type_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_type", user_type_enum, nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "portfolio_projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(length=2000), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_portfolio_projects_id"), "portfolio_projects", ["id"], unique=False)

    op.create_table(
        "properties",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_name", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("price", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_properties_id"), "properties", ["id"], unique=False)

    op.create_table(
        "service_projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("portfolio_project_id", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("ddescription", sa.String(length=2000), nullable=True),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("user_email", sa.String(length=255), nullable=True),
        sa.Column("user_phone", sa.String(length=20), nullable=True),
        sa.ForeignKeyConstraint(
            ["portfolio_project_id"], ["portfolio_projects.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_service_projects_id"), "service_projects", ["id"], unique=False)

    op.create_table(
        "inquiries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("inquiry_text", sa.String(length=2000), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_inquiries_id"), "inquiries", ["id"], unique=False)

    op.create_table(
        "property_images",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_property_images_id"), "property_images", ["id"], unique=False)

    op.create_table(
        "portfolio_images",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("service_project_id", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.ForeignKeyConstraint(["service_project_id"], ["service_projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_portfolio_images_id"), "portfolio_images", ["id"], unique=False)


def downgrade():
    op.drop_index(op.f("ix_portfolio_images_id"), table_name="portfolio_images")
    op.drop_table("portfolio_images")

    op.drop_index(op.f("ix_property_images_id"), table_name="property_images")
    op.drop_table("property_images")

    op.drop_index(op.f("ix_inquiries_id"), table_name="inquiries")
    op.drop_table("inquiries")

    op.drop_index(op.f("ix_service_projects_id"), table_name="service_projects")
    op.drop_table("service_projects")

    op.drop_index(op.f("ix_properties_id"), table_name="properties")
    op.drop_table("properties")

    op.drop_index(op.f("ix_portfolio_projects_id"), table_name="portfolio_projects")
    op.drop_table("portfolio_projects")

    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

    user_type_enum = postgresql.ENUM("admin", "staff", name="user_type_enum")
    user_type_enum.drop(op.get_bind(), checkfirst=True)

