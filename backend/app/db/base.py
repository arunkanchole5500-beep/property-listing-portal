from app.db.base_class import Base

# Import all models here so Alembic can autogenerate migrations
from app.models.user import User  # noqa: E402, F401
from app.models.property import Property, PropertyImage  # noqa: E402, F401
from app.models.portfolio import PortfolioProject, ServiceProject, PortfolioImage  # noqa: E402, F401
from app.models.inquiry import Inquiry  # noqa: E402, F401
