from typing import Optional

from pydantic import BaseModel


class InquiryBase(BaseModel):
    property_id: Optional[int] = None
    name: str
    phone: str
    inquiry_text: str


class InquiryCreate(InquiryBase):
    pass


class InquiryRead(InquiryBase):
    id: int

    class Config:
        from_attributes = True


class PaginatedInquiries(BaseModel):
    items: list[InquiryRead]
    total: int
    page: int
    page_size: int
