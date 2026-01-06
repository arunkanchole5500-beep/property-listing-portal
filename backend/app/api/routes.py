from fastapi import APIRouter

from app.api.v1 import auth, properties, portfolio, inquiries


api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["inquiries"])
