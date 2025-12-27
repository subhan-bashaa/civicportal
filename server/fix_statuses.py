from app.database import SessionLocal, engine, Base
from app import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def fix_null_statuses():
    db = SessionLocal()
    try:
        updated = db.execute("UPDATE complaints SET status = 'open' WHERE status IS NULL")
        db.commit()
        print('Updated rows (driver may not report):', updated)
    except Exception as e:
        print('Error updating statuses:', e)
    finally:
        db.close()

if __name__ == '__main__':
    fix_null_statuses()
