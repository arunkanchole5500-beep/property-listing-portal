from enum import Enum

from sqlalchemy import Column, Enum as PgEnum, Integer, String

from app.db.base_class import Base


class UserType(str, Enum):
    ADMIN = "admin"
    STAFF = "staff"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_type = Column(PgEnum(UserType, name="user_type_enum"), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
