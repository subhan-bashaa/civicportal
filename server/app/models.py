from sqlalchemy import Column, Integer, String, Text
from .database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    image_path = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="open")
