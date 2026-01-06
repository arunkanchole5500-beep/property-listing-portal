from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, Enum as PgEnum
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class PropertyStatus(str, PgEnum):
    pass


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    property_name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)

    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"))
    url = Column(String(500), nullable=False)

    property = relationship("Property", back_populates="images")
