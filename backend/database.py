import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read from environment variables (set in Render dashboard or .env locally)
TIDB_HOST = os.getenv("TIDB_HOST", "gateway01.eu-central-1.prod.aws.tidbcloud.com")
TIDB_PORT = os.getenv("TIDB_PORT", "4000")
TIDB_USER = os.getenv("TIDB_USER", "4Y7oTy8iinm1yD9.root")
TIDB_PASS = os.getenv("TIDB_PASS", "MdMvFmHfQrPWP0D1")
TIDB_DB   = os.getenv("TIDB_DB",   "test")

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{TIDB_USER}:{TIDB_PASS}@{TIDB_HOST}:{TIDB_PORT}/{TIDB_DB}"
    "?ssl_verify_cert=true&ssl_verify_identity=true"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
