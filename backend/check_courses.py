import os
from sqlalchemy import create_engine, text

TIDB_HOST = "gateway01.eu-central-1.prod.aws.tidbcloud.com"
TIDB_PORT = "4000"
TIDB_USER = "2sjvVcdf8znbHaW.root"
TIDB_PASS = "Po00PC8iwytvZRju"
TIDB_DB = "sys"

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{TIDB_USER}:{TIDB_PASS}@{TIDB_HOST}:{TIDB_PORT}/{TIDB_DB}"
    "?ssl_verify_cert=true&ssl_verify_identity=true"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

def alter_tables():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE courses ADD COLUMN level INTEGER;"))
            print("Added level to courses")
        except Exception as e: print("courses level:", e)

        try:
            conn.execute(text("ALTER TABLE transcripts ADD COLUMN degree_classification VARCHAR(50);"))
            print("Added degree_classification to transcripts")
        except Exception as e: print("transcripts classification:", e)
        
        conn.commit()

if __name__ == "__main__":
    alter_tables()
