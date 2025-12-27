from app.database import SessionLocal, engine, Base
from app import models


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(models.Complaint).count()
        if existing == 0:
            items = [
                models.Complaint(title="Pothole on 5th", description="Large pothole near intersection."),
                models.Complaint(title="Streetlight out", description="Lamp post not working for 3 days."),
            ]
            db.add_all(items)
            db.commit()
            print(f"Seeded {len(items)} complaints")
        else:
            print(f"Database already has {existing} complaints, skipping seeding")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
