from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import models
import schemas
from database import engine, get_db
from services.gpa_calculator import calculate_gpa, calculate_cgpa, get_degree_classification
from collections import defaultdict
from typing import List

load_dotenv()

# Create tables if they don't exist
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Failed to create tables: {e}")

# Pre-create Admin user
try:
    db = next(get_db())
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        admin = models.User(
            username="admin",
            password_hash="admin123", # hardcoded as requested
            role="Admin",
            full_name="System Administrator",
            level=0
        )
        db.add(admin)
        db.commit()
except Exception as e:
    print(f"Failed to create admin user: {e}")

app = FastAPI(title="CGPA Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def letter_to_point(grade: str) -> float:
    mapping = {'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0}
    return mapping.get(grade.upper(), 0.0)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CGPA Calculator API"}

@app.post("/auth/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = models.User(
        username=user.username,
        password_hash=user.password, # Plain text for simplicity as per requirements
        role="Student",
        full_name=user.full_name,
        level=user.level
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or user.password_hash != request.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {"message": "Login successful", "user": user}

@app.post("/courses/{user_id}", status_code=status.HTTP_200_OK)
def save_courses(user_id: int, batch: schemas.CourseRecordBatch, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Delete existing records for this user (full replace strategy)
    db.query(models.CourseRecord).filter(models.CourseRecord.user_id == user_id).delete()
    
    for c in batch.courses:
        gp = letter_to_point(c.grade)
        record = models.CourseRecord(
            user_id=user_id,
            course_code=c.course_code,
            course_title=c.course_title,
            credit_units=c.credit_units,
            grade=c.grade.upper(),
            grade_point=gp,
            semester=c.semester,
            level=c.level
        )
        db.add(record)
        
    db.commit()
    return {"message": "Courses saved successfully"}

@app.get("/transcript/{user_id}", response_model=schemas.TranscriptResponse)
def get_transcript(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    records = db.query(models.CourseRecord).filter(models.CourseRecord.user_id == user_id).all()
    
    # Group by level, then semester
    levels_data = defaultdict(lambda: defaultdict(list))
    all_grades = []
    
    for r in records:
        levels_data[r.level][r.semester].append(r)
        all_grades.append({'gp': r.grade_point, 'credit_units': r.credit_units})
        
    total_cgpa = calculate_cgpa(all_grades)
    degree_class = get_degree_classification(total_cgpa)
    
    transcript_levels = []
    for level, semesters in sorted(levels_data.items()):
        sem_list = []
        for sem, courses in semesters.items():
            sem_grades = [{'gp': c.grade_point, 'credit_units': c.credit_units} for c in courses]
            sem_gpa = calculate_gpa(sem_grades)
            sem_list.append({
                "semester": sem,
                "courses": courses,
                "gpa": sem_gpa
            })
        transcript_levels.append({
            "level": level,
            "semesters": sem_list
        })
        
    return {
        "student": user,
        "levels": transcript_levels,
        "total_cgpa": total_cgpa,
        "degree_classification": degree_class
    }

@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_students = db.query(models.User).filter(models.User.role == "Student").count()
    records = db.query(models.CourseRecord).all()
    all_grades = [{'gp': r.grade_point, 'credit_units': r.credit_units} for r in records]
    avg_cgpa = calculate_cgpa(all_grades)
    
    return {
        "total_students": total_students,
        "avg_cgpa": avg_cgpa,
        "active_courses": 12, # Static for CS dept
        "transcripts_generated": total_students # Placeholder
    }

@app.post("/admin/enroll-student", status_code=status.HTTP_201_CREATED)
def enroll_student(request: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username/Matric No already registered")
    
    new_user = models.User(
        username=request.username,
        password_hash=request.password or "password123",
        role="Student",
        full_name=request.full_name,
        level=request.level
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/admin/students", response_model=List[schemas.AdminStudentView])
def get_all_students(db: Session = Depends(get_db)):
    students = db.query(models.User).filter(models.User.role == "Student").all()
    result = []
    for s in students:
        records = db.query(models.CourseRecord).filter(models.CourseRecord.user_id == s.id).all()
        all_grades = [{'gp': r.grade_point, 'credit_units': r.credit_units} for r in records]
        cgpa = calculate_cgpa(all_grades)
        degree = get_degree_classification(cgpa)
        
        result.append({
            "id": s.id,
            "full_name": s.full_name or "Unknown",
            "username": s.username,
            "level": s.level or 100,
            "total_cgpa": cgpa,
            "degree_classification": degree
        })
    return result
