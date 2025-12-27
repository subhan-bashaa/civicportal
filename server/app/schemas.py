from pydantic import BaseModel
from typing import Optional


class ComplaintBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None


class ComplaintCreate(ComplaintBase):
    pass


class Complaint(ComplaintBase):
    id: int
    image_path: Optional[str] = None
    status: Optional[str] = None

    class Config:
        orm_mode = True
