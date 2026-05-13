from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import date

class RoleEnum(str, Enum):
    admin = "Admin"
    lecturer = "Lecturer"
    student = "Student"

class UserBase(BaseModel):
    username: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class GradeUpload(BaseModel):
    student_id: int
    course_code: str
    score: float

class GradeResponse(GradeUpload):
    id: int
    grade_letter: str
    gp: float
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class CourseResponse(BaseModel):
    id: int
    course_code: str
    course_title: str
    credit_units: int
    semester: str
    level: Optional[int] = None
    
    class Config:
        from_attributes = True

class TranscriptResponse(BaseModel):
    student_id: int
    cgpa: float
    degree_classification: Optional[str] = None
    
    class Config:
        from_attributes = True

class StudentProfileBase(BaseModel):
    full_name: Optional[str] = None
    matric_no: Optional[str] = None
    faculty: Optional[str] = None
    department: Optional[str] = None
    current_level: Optional[int] = None
    student_type: Optional[str] = None
    session: Optional[str] = None
    enrollment_year: Optional[int] = None

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class CourseRegistrationRequest(BaseModel):
    course_codes: List[str]

class EnrollStudentRequest(BaseModel):
    student_id: str
    full_name: str
    level: int
    department: str
