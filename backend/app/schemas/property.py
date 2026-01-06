from typing import List, Optional

from pydantic import BaseModel


class PropertyImageBase(BaseModel):
    url: str


class PropertyImageCreate(PropertyImageBase):
    pass


class PropertyImageRead(PropertyImageBase):
    id: int

    class Config:
        from_attributes = True


class PropertyBase(BaseModel):
    property_name: str
    type: str
    price: float
    location: str
    status: str


class PropertyCreate(PropertyBase):
    images: Optional[List[PropertyImageCreate]] = None


class PropertyUpdate(BaseModel):
    property_name: Optional[str] = None
    type: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    status: Optional[str] = None
    images: Optional[List[PropertyImageCreate]] = None


class PropertyRead(PropertyBase):
    id: int
    images: List[PropertyImageRead] = []

    class Config:
        from_attributes = True


class PaginatedProperties(BaseModel):
    items: list[PropertyRead]
    total: int
    page: int
    page_size: int
