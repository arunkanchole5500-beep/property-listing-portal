from sqlalchemy import Column, ForeignKey, Integer, String

from app.db.base_class import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    inquiry_text = Column(String(2000), nullable=False)
