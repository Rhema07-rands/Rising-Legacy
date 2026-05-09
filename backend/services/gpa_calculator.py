def calculate_grade_point(score: float) -> tuple[str, float]:
    """
    Returns (grade_letter, grade_point) based on BIU 5.0 scale.
    70 - 100: A (5.0 Points)
    60 - 69: B (4.0 Points)
    50 - 59: C (3.0 Points)
    45 - 49: D (2.0 Points)
    40 - 44: E (1.0 Point)
    0 - 39: F (0 Point)
    """
    if score >= 70:
        return 'A', 5.0
    elif score >= 60:
        return 'B', 4.0
    elif score >= 50:
        return 'C', 3.0
    elif score >= 45:
        return 'D', 2.0
    elif score >= 40:
        return 'E', 1.0
    else:
        return 'F', 0.0

def calculate_gpa(grades: list[dict]) -> float:
    """
    Expects a list of dicts with 'gp' and 'credit_units'.
    GPA = Total Quality Points (TQP) / Total Credit Units (TCU)
    Quality Points = Credit Units (CU) * Grade Point (GP)
    """
    tqp = sum(g['gp'] * g['credit_units'] for g in grades)
    tcu = sum(g['credit_units'] for g in grades)
    if tcu == 0:
        return 0.0
    return round(tqp / tcu, 2)

def calculate_cgpa(all_grades: list[dict]) -> float:
    """
    CGPA is calculated by adding the TQP for all semesters to date 
    and dividing by the TCU for all semesters to date.
    """
    return calculate_gpa(all_grades)

def get_degree_classification(cgpa: float) -> str:
    """Returns degree classification based on BIU CGPA scale."""
    if cgpa >= 4.50:
        return "1st Class"
    elif cgpa >= 3.50:
        return "2nd Class Upper"
    elif cgpa >= 2.40:
        return "2nd Class Lower"
    elif cgpa >= 1.50:
        return "3rd Class"
    else:
        return "Fail"
