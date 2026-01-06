from typing import List, Optional

from pydantic import BaseModel


class PortfolioProjectBase(BaseModel):
    title: str
    description: Optional[str] = None


class PortfolioProjectCreate(PortfolioProjectBase):
    pass


class PortfolioProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class PortfolioImageBase(BaseModel):
    url: str


class PortfolioImageCreate(PortfolioImageBase):
    pass


class PortfolioImageRead(PortfolioImageBase):
    id: int

    class Config:
        from_attributes = True


class ServiceProjectBase(BaseModel):
    portfolio_project_id: int
    title: str
    ddescription: Optional[str] = None
    location: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None


class ServiceProjectCreate(ServiceProjectBase):
    images: Optional[List[PortfolioImageCreate]] = None


class ServiceProjectUpdate(BaseModel):
    title: Optional[str] = None
    ddescription: Optional[str] = None
    location: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    images: Optional[List[PortfolioImageCreate]] = None


class ServiceProjectRead(ServiceProjectBase):
    id: int
    images: List[PortfolioImageRead] = []

    class Config:
        from_attributes = True


class PortfolioProjectRead(PortfolioProjectBase):
    id: int
    service_projects: List[ServiceProjectRead] = []

    class Config:
        from_attributes = True


class PaginatedPortfolioProjects(BaseModel):
    items: list[PortfolioProjectRead]
    total: int
    page: int
    page_size: int
