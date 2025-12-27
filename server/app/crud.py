from sqlalchemy.orm import Session
from . import models, schemas


def get_complaint(db: Session, complaint_id: int):
    return db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()


def get_complaints(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Complaint).offset(skip).limit(limit).all()


def create_complaint(db: Session, *, title: str, description: str | None = None, category: str | None = None, address: str | None = None, image_path: str | None = None, status: str | None = None):
    # Ensure status is set to a default value to avoid nulls
    st = status or 'open'
    db_obj = models.Complaint(title=title, description=description, category=category, address=address, image_path=image_path, status=st)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
