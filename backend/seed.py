from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, RoleEnum, Student, Course, Grade, Transcript
from services.gpa_calculator import calculate_grade_point, calculate_cgpa
import datetime

# Make sure tables exist
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    # 1. Seed Users (Demo Accounts)
    print("Seeding Users...")
    users = [
        User(username="admin", password_hash="admin123_fakehash", role=RoleEnum.admin),
        User(username="lecturer", password_hash="lecturer123_fakehash", role=RoleEnum.lecturer),
        User(username="student", password_hash="student123_fakehash", role=RoleEnum.student),
    ]
    
    # Only add if they don't exist
    for u in users:
        if not db.query(User).filter(User.username == u.username).first():
            db.add(u)
    db.commit()

    student_user = db.query(User).filter(User.username == "student").first()

    # 2. Seed Student Profile
    print("Seeding Student Profile...")
    if not db.query(Student).filter(Student.user_id == student_user.id).first():
        student_profile = Student(
            user_id=student_user.id,
            department="COMPUTER SCIENCE",
            enrollment_year=2022,
            current_level=100
        )
        db.add(student_profile)
        db.commit()

    student_profile = db.query(Student).filter(Student.user_id == student_user.id).first()

    # 3. Seed Courses (100L)
    print("Seeding Courses...")
    courses_data = [
        {"code": "CHM 111", "title": "GENERAL CHEMISTRY (PHYSICAL AND INORGANIC)", "units": 2, "sem": "First"},
        {"code": "CHM 113", "title": "PRACTICAL CHEMISTRY I", "units": 1, "sem": "First"},
        {"code": "CSC 111", "title": "INTRODUCTION TO COMPUTING I", "units": 2, "sem": "First"},
        {"code": "CSC 112", "title": "INTRODUCTION TO COMPUTER PRACTICAL", "units": 1, "sem": "First"},
        {"code": "FRN 111", "title": "COMMUNICATION IN FRENCH I", "units": 1, "sem": "First"},
        {"code": "GST 111", "title": "COMMUNICATION IN ENGLISH I", "units": 2, "sem": "First"},
        {"code": "GST 112", "title": "LOGIC, PHILOSOPHY AND HUMAN EXISTENCE", "units": 2, "sem": "First"},
        {"code": "GST 113", "title": "NIGERIAN PEOPLES AND CULTURE", "units": 2, "sem": "First"},
        {"code": "IDS 111", "title": "RUDIMENTS OF CHRISTIAN LIFE", "units": 1, "sem": "First"},
        {"code": "MTH 111", "title": "ALGEBRA AND TRIGONOMETRY", "units": 3, "sem": "First"},
        {"code": "MTH 112", "title": "STATISTICS FOR PHYSICAL SCIENCES AND ENGINEERING", "units": 3, "sem": "First"},
        {"code": "PHY 111", "title": "GENERAL PHYSICS", "units": 3, "sem": "First"},
        {"code": "PHY 113", "title": "GENERAL PHYSICS LABORATORY I", "units": 1, "sem": "First"},
        
        {"code": "CSC 121", "title": "INTRODUCTION TO COMPUTING II", "units": 2, "sem": "Second"},
        {"code": "CSC 122", "title": "PROGRAMMING IN VISUAL BASIC", "units": 2, "sem": "Second"},
        {"code": "CSC 123", "title": "VISUAL BASIC.NET/BASIC PRACTICAL", "units": 1, "sem": "Second"},
        {"code": "FRN 121", "title": "COMMUNICATION IN FRENCH II", "units": 1, "sem": "Second"},
        {"code": "GST 121", "title": "USE OF LIBRARY, STUDY SKILLS AND INFO COMM TECH", "units": 2, "sem": "Second"},
        {"code": "GST 122", "title": "COMMUNICATION IN ENGLISH II", "units": 2, "sem": "Second"},
        {"code": "GST 124", "title": "HISTORY AND PHILOSOPHY OF SCIENCE", "units": 2, "sem": "Second"},
        {"code": "IDS 121", "title": "LIFE AND TIMES OF THE ARCHBISHOP BENSON IDAHOSA", "units": 1, "sem": "Second"},
        {"code": "MTH 121", "title": "VECTOR AND GEOMETRY", "units": 3, "sem": "Second"},
        {"code": "MTH 122", "title": "CALCULUS", "units": 3, "sem": "Second"},
        {"code": "PHY 121", "title": "GENERAL PHYSICS II", "units": 3, "sem": "Second"},
        {"code": "PHY 123", "title": "GENERAL PHYSICS LABORATORY II", "units": 1, "sem": "Second"},
    ]
    
    for c in courses_data:
        if not db.query(Course).filter(Course.course_code == c["code"]).first():
            course = Course(
                course_code=c["code"],
                course_title=c["title"],
                credit_units=c["units"],
                semester=c["sem"]
            )
            db.add(course)
    db.commit()

    # 4. Seed some initial grades for the student
    print("Seeding Initial Grades...")
    sample_scores = {
        "CHM 111": 75, "CHM 113": 60, "CSC 111": 82, "CSC 112": 88, 
        "FRN 111": 65, "GST 111": 71, "GST 112": 55, "GST 113": 68,
        "IDS 111": 70, "MTH 111": 45, "MTH 112": 62, "PHY 111": 58, "PHY 113": 75
    }

    grades_to_calc = []
    
    for course_code, score in sample_scores.items():
        if not db.query(Grade).filter(Grade.student_id == student_profile.id, Grade.course_code == course_code).first():
            grade_letter, gp = calculate_grade_point(score)
            g = Grade(
                student_id=student_profile.id,
                course_code=course_code,
                score=score,
                grade_letter=grade_letter,
                gp=gp
            )
            db.add(g)
            
            c = db.query(Course).filter(Course.course_code == course_code).first()
            if c:
                grades_to_calc.append({"gp": gp, "credit_units": c.credit_units})

    db.commit()

    # Calculate and store CGPA
    if grades_to_calc:
        cgpa = calculate_cgpa(grades_to_calc)
        t = db.query(Transcript).filter(Transcript.student_id == student_profile.id).first()
        if not t:
            t = Transcript(student_id=student_profile.id, cgpa=cgpa)
            db.add(t)
        else:
            t.cgpa = cgpa
        db.commit()

    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()
