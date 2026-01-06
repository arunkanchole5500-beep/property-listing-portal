from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db_dep, require_role
from app.models.inquiry import Inquiry
from app.models.user import UserType
from app.schemas.inquiry import InquiryCreate, InquiryRead, PaginatedInquiries


router = APIRouter()


@router.post("/", response_model=InquiryRead)
def create_inquiry(*, db: Session = Depends(get_db_dep), inquiry_in: InquiryCreate):
    inquiry = Inquiry(**inquiry_in.dict())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get(
    "/",
    response_model=PaginatedInquiries,
    dependencies=[Depends(require_role(UserType.ADMIN, UserType.STAFF))],
)
def list_inquiries(
    *,
    db: Session = Depends(get_db_dep),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    query = db.query(Inquiry)
    total = query.count()
    items = (
        query.order_by(Inquiry.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return PaginatedInquiries(items=items, total=total, page=page, page_size=page_size)
