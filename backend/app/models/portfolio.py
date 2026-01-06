from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=True)

    service_projects = relationship("ServiceProject", back_populates="portfolio_project", cascade="all, delete-orphan")


class ServiceProject(Base):
    __tablename__ = "service_projects"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_project_id = Column(Integer, ForeignKey("portfolio_projects.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    ddescription = Column(String(2000), nullable=True)
    location = Column(String(255), nullable=True)
    user_email = Column(String(255), nullable=True)
    user_phone = Column(String(20), nullable=True)

    portfolio_project = relationship("PortfolioProject", back_populates="service_projects")
    images = relationship("PortfolioImage", back_populates="service_project", cascade="all, delete-orphan")


class PortfolioImage(Base):
    __tablename__ = "portfolio_images"

    id = Column(Integer, primary_key=True, index=True)
    service_project_id = Column(Integer, ForeignKey("service_projects.id", ondelete="CASCADE"))
    url = Column(String(500), nullable=False)

    service_project = relationship("ServiceProject", back_populates="images")
