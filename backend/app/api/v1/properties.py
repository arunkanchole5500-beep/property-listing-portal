from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_db_dep, require_role
from app.models.property import Property, PropertyImage
from app.models.user import UserType
from app.schemas.property import (
    PaginatedProperties,
    PropertyCreate,
    PropertyRead,
    PropertyUpdate,
)


router = APIRouter()


@router.get("/", response_model=PaginatedProperties)
def list_properties(
    *,
    db: Session = Depends(get_db_dep),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    type: Optional[str] = None,
    location: Optional[str] = None,
    status: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    query = db.query(Property)
    if type:
        query = query.filter(Property.type == type)
    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if status:
        query = query.filter(Property.status == status)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)

    total = query.count()
    items = (
        query.order_by(Property.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return PaginatedProperties(items=items, total=total, page=page, page_size=page_size)


@router.get("/{property_id}", response_model=PropertyRead)
def get_property(property_id: int, db: Session = Depends(get_db_dep)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    return prop


@router.post("/", response_model=PropertyRead, dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))])
def create_property(*, db: Session = Depends(get_db_dep), property_in: PropertyCreate):
    prop = Property(
        property_name=property_in.property_name,
        type=property_in.type,
        price=property_in.price,
        location=property_in.location,
        status=property_in.status,
    )
    db.add(prop)
    db.flush()

    if property_in.images:
        for img in property_in.images:
            db.add(PropertyImage(property_id=prop.id, url=img.url))

    db.commit()
    db.refresh(prop)
    return prop


@router.put("/{property_id}", response_model=PropertyRead, dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))])
def update_property(
    *, db: Session = Depends(get_db_dep), property_id: int, property_in: PropertyUpdate
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    for field, value in property_in.dict(exclude_unset=True).items():
        if field != "images":
            setattr(prop, field, value)

    if property_in.images is not None:
        db.query(PropertyImage).filter(PropertyImage.property_id == property_id).delete()
        for img in property_in.images:
            db.add(PropertyImage(property_id=property_id, url=img.url))

    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))])
def delete_property(*, db: Session = Depends(get_db_dep), property_id: int):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    db.delete(prop)
    db.commit()
    return None
