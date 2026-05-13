from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import models
import schemas
from database import engine, get_db
from services.gpa_calculator import calculate_grade_point, calculate_cgpa, get_degree_classification

load_dotenv()  # Loads backend/.env when running locally

# Create tables if they don't exist
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Failed to create tables: {e}")

app = FastAPI(title="Grading System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Automated Electronic Grading System API"}

@app.post("/users/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # In a real app, hash the password properly (e.g. using passlib bcrypt)
    fake_hashed_password = user.password + "notreallyhashed"
    new_user = models.User(
        username=user.username,
        password_hash=fake_hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/grades/upload", response_model=schemas.GradeResponse)
def upload_grade(grade: schemas.GradeUpload, db: Session = Depends(get_db)):
    # 1. Validate student and course exist
    student = db.query(models.Student).filter(models.Student.id == grade.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    course = db.query(models.Course).filter(models.Course.course_code == grade.course_code).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # 2. Calculate grade point
    grade_letter, gp = calculate_grade_point(grade.score)
    
    # 3. Create Grade record
    new_grade = models.Grade(
        student_id=grade.student_id,
        course_code=grade.course_code,
        score=grade.score,
        grade_letter=grade_letter,
        gp=gp
    )
    db.add(new_grade)
    
    # 4. Trigger CGPA Recalculation
    # Get all previous grades for the student
    all_grades = db.query(models.Grade).filter(models.Grade.student_id == grade.student_id).all()
    
    # Combine previous grades and the new grade for calculation
    calc_grades = []
    for g in all_grades:
        c = db.query(models.Course).filter(models.Course.course_code == g.course_code).first()
        if c:
            calc_grades.append({"gp": g.gp, "credit_units": c.credit_units})
            
    # Include the new grade as well since it hasn't been committed yet
    calc_grades.append({"gp": gp, "credit_units": course.credit_units})
            
    new_cgpa = calculate_cgpa(calc_grades)
    
    # Update Transcript or create one
    transcript = db.query(models.Transcript).filter(models.Transcript.student_id == grade.student_id).first()
    if transcript:
        transcript.cgpa = new_cgpa
        transcript.degree_classification = get_degree_classification(new_cgpa)
    else:
        new_transcript = models.Transcript(
            student_id=grade.student_id, 
            cgpa=new_cgpa, 
            degree_classification=get_degree_classification(new_cgpa)
        )
        db.add(new_transcript)

    db.commit()
    db.refresh(new_grade)
    return new_grade

@app.post("/auth/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    # Using simplistic check since we just mocked fake hashes
    if not user or not user.password_hash.startswith(request.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    student_profile = None
    if user.role == models.RoleEnum.student:
        student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
        if student:
            student_profile = {"id": student.id, "department": student.department, "level": student.current_level}

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        },
        "student_profile": student_profile
    }

@app.get("/courses", response_model=list[schemas.CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.get("/students/{student_id}/grades")
def get_student_grades(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    grades = db.query(models.Grade).filter(models.Grade.student_id == student_id).all()
    transcript = db.query(models.Transcript).filter(models.Transcript.student_id == student_id).first()
    
    grade_data = []
    for g in grades:
        course = db.query(models.Course).filter(models.Course.course_code == g.course_code).first()
        grade_data.append({
            "course_code": g.course_code,
            "course_title": course.course_title if course else "Unknown",
            "credit_units": course.credit_units if course else 0,
            "semester": course.semester if course else "Unknown",
            "level": course.level if course else None,
            "score": g.score,
            "grade_letter": g.grade_letter,
            "gp": g.gp
        })
        
    return {
        "student_id": student.id,
        "cgpa": transcript.cgpa if transcript else 0.0,
        "degree_classification": transcript.degree_classification if transcript else "N/A",
        "grades": grade_data
    }

@app.get("/students/{student_id}/profile", response_model=schemas.StudentProfileResponse)
def get_student_profile(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/students/{student_id}/profile", response_model=schemas.StudentProfileResponse)
def update_student_profile(student_id: int, profile: schemas.StudentProfileUpdate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = profile.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
        
    db.commit()
    db.refresh(student)
    return student

@app.post("/students/{student_id}/register_courses")
def register_courses(student_id: int, request: schemas.CourseRegistrationRequest, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    # For a real system, you'd have a Registration table.
    # For now, we will create empty Grade records (score=0, letter='–', gp=0) for these courses
    registered_count = 0
    for code in request.course_codes:
        # Check if already exists
        existing = db.query(models.Grade).filter(models.Grade.student_id == student_id, models.Grade.course_code == code).first()
        if not existing:
            new_reg = models.Grade(
                student_id=student_id,
                course_code=code,
                score=0.0,
                grade_letter='–',
                gp=0.0
            )
            db.add(new_reg)
            registered_count += 1
            
    db.commit()
    return {"message": f"Successfully registered for {registered_count} courses."}

