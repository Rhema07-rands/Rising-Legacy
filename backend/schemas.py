from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    full_name: str
    username: str # matric_no
    password: str
    level: int

class UserResponse(BaseModel):
    id: int
    full_name: str
    username: str
    level: int
    role: str
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    message: str
    user: UserResponse

class CourseRecordCreate(BaseModel):
    course_code: str
    course_title: str
    credit_units: int
    grade: str # A, B, C, D, E, F
    semester: str
    level: int

class CourseRecordBatch(BaseModel):
    courses: List[CourseRecordCreate]

class CourseRecordResponse(CourseRecordCreate):
    id: int
    grade_point: float

    class Config:
        from_attributes = True

class TranscriptSemester(BaseModel):
    semester: str
    courses: List[CourseRecordResponse]
    gpa: float

class TranscriptLevel(BaseModel):
    level: int
    semesters: List[TranscriptSemester]

class TranscriptResponse(BaseModel):
    student: UserResponse
    levels: List[TranscriptLevel]
    total_cgpa: float
    degree_classification: str

class AdminStudentView(BaseModel):
    id: int
    full_name: str
    username: str
    level: int
    total_cgpa: float
    degree_classification: str
