from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True) # matric_no for students, 'admin' for admin
    password_hash = Column(String(255))
    role = Column(String(20), default="Student") # "Admin" or "Student"
    
    # Student specific fields
    full_name = Column(String(200), nullable=True)
    level = Column(Integer, nullable=True) # 100, 200, 300, 400

    courses = relationship("CourseRecord", back_populates="user", cascade="all, delete-orphan")

class CourseRecord(Base):
    __tablename__ = "course_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    course_code = Column(String(20))
    course_title = Column(String(200))
    credit_units = Column(Integer)
    
    grade = Column(String(2)) # A, B, C, D, E, F
    grade_point = Column(Float) # 5.0, 4.0, etc.
    
    semester = Column(String(20)) # "First", "Second"
    level = Column(Integer) # 100, 200, 300, 400

    user = relationship("User", back_populates="courses")
