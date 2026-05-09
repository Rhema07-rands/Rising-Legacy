from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import datetime

def generate_transcript_pdf(student_info: dict, grades: list[dict], cgpa: float, degree_class: str) -> bytes:
    """
    Generates a PDF transcript for a student using ReportLab.
    Returns the PDF as a bytes object.
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2.0, height - 50, "Benson Idahosa University")
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2.0, height - 70, "Official Academic Transcript")

    # Student Info
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 120, f"Name: {student_info.get('name', 'Unknown')}")
    c.drawString(50, height - 140, f"Student ID: {student_info.get('student_id', 'N/A')}")
    c.drawString(50, height - 160, f"Department: {student_info.get('department', 'N/A')}")
    
    # Date
    c.drawString(width - 200, height - 120, f"Issue Date: {datetime.date.today().strftime('%B %d, %Y')}")

    # Grades Table Header
    y = height - 210
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Course Code")
    c.drawString(150, y, "Course Title")
    c.drawString(400, y, "Units")
    c.drawString(450, y, "Grade")
    c.drawString(500, y, "GP")
    
    c.line(50, y - 5, 550, y - 5)
    
    y -= 25
    c.setFont("Helvetica", 10)
    for grade in grades:
        c.drawString(50, y, grade.get('course_code', ''))
        c.drawString(150, y, grade.get('title', '')[:40]) # Truncate long titles
        c.drawString(400, y, str(grade.get('units', '')))
        c.drawString(450, y, grade.get('grade_letter', ''))
        c.drawString(500, y, str(grade.get('gp', '')))
        y -= 20
        
        if y < 100:
            c.showPage()
            c.setFont("Helvetica", 10)
            y = height - 50
            
    # Summary
    y -= 20
    c.line(50, y, 550, y)
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, f"Cumulative Grade Point Average (CGPA): {cgpa:.2f}")
    c.drawString(50, y - 20, f"Degree Classification: {degree_class}")

    # Footer
    c.setFont("Helvetica-Oblique", 10)
    c.drawCentredString(width / 2.0, 50, "This document is confidential and issued without any erasure or alteration.")

    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf
