from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import traceback
import os
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import shutil

from . import models, crud, schemas
from .database import engine, Base, get_db
from sqlalchemy.orm import Session


# basic logger
logger = logging.getLogger("uvicorn.error")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Civic Portal API")

# serve uploaded files from server/uploads at /uploads
uploads_dir = os.path.join(os.path.dirname(__file__), '..', 'uploads')
uploads_dir = os.path.abspath(uploads_dir)
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DEBUG = os.getenv("DEBUG", "1") in ("1", "true", "True")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    logger.error("Unhandled exception on %s %s:\n%s", request.method, request.url, tb)
    content = {"detail": "Internal Server Error", "error": str(exc)}
    if DEBUG:
        content["trace"] = tb
    return JSONResponse(status_code=500, content=content)

@app.get("/", response_model=dict)
def read_root():
    return {"status": "ok"}

@app.get("/complaints", response_model=list[schemas.Complaint])
def list_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_complaints(db, skip=skip, limit=limit)

@app.post("/complaints", response_model=schemas.Complaint)
def create_complaint(
    title: str = Form(...),
    description: str | None = Form(None),
    category: str | None = Form(None),
    address: str | None = Form(None),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_path = None
    if file is not None:
        # save uploaded file to uploads_dir with a uuid filename
        filename = file.filename or "upload"
        ext = os.path.splitext(filename)[1]
        unique = f"{uuid4().hex}{ext}"
        dest_path = os.path.join(uploads_dir, unique)
        with open(dest_path, "wb") as out_file:
            shutil.copyfileobj(file.file, out_file)
        # set a URL path that clients can use
        image_path = f"/uploads/{unique}"

    return crud.create_complaint(db, title=title, description=description, category=category, address=address, image_path=image_path)

@app.get("/complaints/{complaint_id}", response_model=schemas.Complaint)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    db_obj = crud.get_complaint(db, complaint_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return db_obj
