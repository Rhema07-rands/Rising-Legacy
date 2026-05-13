from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
import enum
from datetime import date
from database import Base

class RoleEnum(str, enum.Enum):
    admin = "Admin"
    lecturer = "Lecturer"
    student = "Student"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(Enum(RoleEnum), default=RoleEnum.student)

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String(200))
    matric_no = Column(String(50), unique=True)
    faculty = Column(String(100))
    department = Column(String(100))
    current_level = Column(Integer) # e.g., 100, 200, 300, 400
    student_type = Column(String(50)) # e.g., "FULL TIME STUDENT"
    session = Column(String(20)) # e.g., "2025/2026"
    enrollment_year = Column(Integer)

    user = relationship("User", back_populates="student_profile")
    grades = relationship("Grade", back_populates="student")
    transcripts = relationship("Transcript", back_populates="student")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(20), unique=True, index=True)
    course_title = Column(String(200))
    credit_units = Column(Integer)
    semester = Column(String(20)) # e.g., "First", "Second"
    level = Column(Integer) # e.g., 100, 200, 300, 400

    grades = relationship("Grade", back_populates="course")

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_code = Column(String(20), ForeignKey("courses.course_code"))
    score = Column(Float)
    grade_letter = Column(String(2)) # A, B, C, D, E, F
    gp = Column(Float) # 5.0, 4.0, etc.

    student = relationship("Student", back_populates="grades")
    course = relationship("Course", back_populates="grades")

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    issue_date = Column(Date, default=date.today)
    cgpa = Column(Float)
    degree_classification = Column(String(50))

    student = relationship("Student", back_populates="transcripts")
