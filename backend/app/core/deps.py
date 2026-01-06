from typing import Generator

from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User, UserType


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_db_dep() -> Generator[Session, None, None]:
    yield from get_db()


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db_dep)
) -> User:
    email = decode_token(token)
    if email is None:
        raise UnauthorizedException()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise UnauthorizedException()
    return user


def require_role(*allowed_roles: UserType):
    def role_checker(user: User = Depends(get_current_user)) -> User:
        if user.user_type not in allowed_roles:
            raise ForbiddenException()
        return user

    return role_checker
