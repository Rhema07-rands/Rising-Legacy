import models
from database import engine
from sqlalchemy import text

print("Dropping tables using raw SQL...")
with engine.connect() as conn:
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
    conn.execute(text("DROP TABLE IF EXISTS transcripts;"))
    conn.execute(text("DROP TABLE IF EXISTS grades;"))
    conn.execute(text("DROP TABLE IF EXISTS students;"))
    conn.execute(text("DROP TABLE IF EXISTS courses;"))
    conn.execute(text("DROP TABLE IF EXISTS users;"))
    conn.execute(text("DROP TABLE IF EXISTS course_records;"))
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    conn.commit()

print("Creating new tables...")
models.Base.metadata.create_all(bind=engine)

print("Database reset successful!")
