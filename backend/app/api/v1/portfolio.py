from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_db_dep, require_role
from app.models.portfolio import PortfolioProject, ServiceProject, PortfolioImage
from app.models.user import UserType
from app.schemas.portfolio import (
    PaginatedPortfolioProjects,
    PortfolioProjectCreate,
    PortfolioProjectRead,
    PortfolioProjectUpdate,
    ServiceProjectCreate,
    ServiceProjectRead,
    ServiceProjectUpdate,
)


router = APIRouter()


@router.get("/projects", response_model=PaginatedPortfolioProjects)
def list_portfolio_projects(
    *,
    db: Session = Depends(get_db_dep),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    query = db.query(PortfolioProject)
    total = query.count()
    items = (
        query.order_by(PortfolioProject.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return PaginatedPortfolioProjects(items=items, total=total, page=page, page_size=page_size)


@router.post(
    "/projects",
    response_model=PortfolioProjectRead,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def create_portfolio_project(
    *, db: Session = Depends(get_db_dep), project_in: PortfolioProjectCreate
):
    project = PortfolioProject(**project_in.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put(
    "/projects/{project_id}",
    response_model=PortfolioProjectRead,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def update_portfolio_project(
    *, db: Session = Depends(get_db_dep), project_id: int, project_in: PortfolioProjectUpdate
):
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    for field, value in project_in.dict(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def delete_portfolio_project(*, db: Session = Depends(get_db_dep), project_id: int):
    project = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


@router.get("/services", response_model=list[ServiceProjectRead])
def list_service_projects(db: Session = Depends(get_db_dep)):
    services = db.query(ServiceProject).order_by(ServiceProject.id.desc()).all()
    return services


@router.post(
    "/services",
    response_model=ServiceProjectRead,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def create_service_project(
    *, db: Session = Depends(get_db_dep), service_in: ServiceProjectCreate
):
    service = ServiceProject(
        portfolio_project_id=service_in.portfolio_project_id,
        title=service_in.title,
        ddescription=service_in.ddescription,
        location=service_in.location,
        user_email=service_in.user_email,
        user_phone=service_in.user_phone,
    )
    db.add(service)
    db.flush()

    if service_in.images:
        for img in service_in.images:
            db.add(PortfolioImage(service_project_id=service.id, url=img.url))

    db.commit()
    db.refresh(service)
    return service


@router.put(
    "/services/{service_id}",
    response_model=ServiceProjectRead,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def update_service_project(
    *, db: Session = Depends(get_db_dep), service_id: int, service_in: ServiceProjectUpdate
):
    service = db.query(ServiceProject).filter(ServiceProject.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    for field, value in service_in.dict(exclude_unset=True).items():
        if field != "images":
            setattr(service, field, value)

    if service_in.images is not None:
        db.query(PortfolioImage).filter(PortfolioImage.service_project_id == service_id).delete()
        for img in service_in.images:
            db.add(PortfolioImage(service_project_id=service_id, url=img.url))

    db.commit()
    db.refresh(service)
    return service


@router.delete(
    "/services/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def delete_service_project(*, db: Session = Depends(get_db_dep), service_id: int):
    service = db.query(ServiceProject).filter(ServiceProject.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    db.delete(service)
    db.commit()
    return None
