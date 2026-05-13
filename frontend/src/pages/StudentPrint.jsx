import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';
import './StudentPrint.css';

export default function StudentPrint() {
  const [firstSemester, setFirstSemester] = useState([]);
  const [secondSemester, setSecondSemester] = useState([]);
  const [cgpa, setCgpa] = useState("0.00");
  const [degreeClass, setDegreeClass] = useState("N/A");
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "–",
    matricNo: "–",
    faculty: "–",
    department: "–",
    level: "–",
    type: "–",
    session: "–",
  });

  const studentProfile = JSON.parse(localStorage.getItem('student_profile') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!studentProfile.id) return;
        
        // Fetch Profile
        const profRes = await axios.get(`${API_BASE}/students/${studentProfile.id}/profile`);
        setProfile({
          name: profRes.data.full_name || "–",
          matricNo: profRes.data.matric_no || "–",
          faculty: profRes.data.faculty || "–",
          department: profRes.data.department || "–",
          level: profRes.data.current_level || "–",
          type: profRes.data.student_type || "–",
          session: profRes.data.session || "–",
        });

        // Fetch Grades
        const res = await axios.get(`${API_BASE}/students/${studentProfile.id}/grades`);
        const grades = res.data.grades;
        setFirstSemester(grades.filter(g => g.semester === 'First'));
        setSecondSemester(grades.filter(g => g.semester === 'Second'));
        setCgpa(res.data.cgpa.toFixed(2));
        setDegreeClass(res.data.degree_classification || "N/A");
      } catch (err) {
        console.error("Failed to fetch print data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstSemUnits = firstSemester.reduce((acc, c) => acc + (c.credit_units || 0), 0);
  const firstSemQP = firstSemester.reduce((acc, c) => acc + ((c.credit_units || 0) * c.gp), 0);
  
  const secondSemUnits = secondSemester.reduce((acc, c) => acc + (c.credit_units || 0), 0);
  const secondSemQP = secondSemester.reduce((acc, c) => acc + ((c.credit_units || 0) * c.gp), 0);

  const totalUnits = firstSemUnits + secondSemUnits;
  const totalQP = firstSemQP + secondSemQP;

  return (
    <div className="print-container">
      {/* Non-printable controls */}
      <div className="print-controls no-print">
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => window.print()} className="print-btn primary">
            <Printer size={16} /> Print Document
          </button>
          <button className="print-btn secondary">
            <Download size={16} /> Download PDF
          </button>
        </div>
        <button onClick={() => navigate('/student')} className="print-btn secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* The Printable Document */}
      <div className="print-document">
        
        {/* Document Header */}
        <div className="doc-header">
          <div className="doc-brand">
            <div className="doc-logo-placeholder">
              {/* Replace with actual BIU logo image tag */}
              <div style={{ width: '60px', height: '60px', border: '2px solid #0b5394', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b5394', fontWeight: 'bold' }}>BIU</div>
            </div>
            <div>
              <h1 className="uni-name">BENSON IDAHOSA</h1>
              <h1 className="uni-name">UNIVERSITY</h1>
            </div>
          </div>
          
          <div className="doc-title-bar">
            <h2>OFFICIAL ACADEMIC RESULT</h2>
          </div>
        </div>

        {/* Info Section */}
        <div className="doc-info-section">
          
          <div className="student-profile">
            <div className="profile-photo">
              {/* Profile Photo Placeholder */}
            </div>
            <div className="profile-details">
              <p><strong>Full-Name:</strong> {profile.name}</p>
              <p><strong>Matric No:</strong> {profile.matricNo}</p>
              <p><strong>Faculty:</strong> {profile.faculty}</p>
              <p><strong>Department:</strong> {profile.department}</p>
              <p><strong>Level:</strong> {profile.level}</p>
              <p><strong>Student Type:</strong> {profile.type}</p>
            </div>
          </div>

          <div className="contact-details">
            <h3 className="section-heading">CONTACT</h3>
            <p>Benson Idahosa University<br/>P.M.B. 1100, Benin City,<br/>Nigeria.<br/><a href="http://www.biu.edu.ng/">http://www.biu.edu.ng/</a></p>
          </div>

          <div className="registration-details">
            <h3 className="section-heading">RESULT DETAILS:</h3>
            <p><strong>Date Printed:</strong> {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p><strong>Session:</strong> {profile.session}</p>
            <p><strong>Total Credits Registered:</strong> {totalUnits} UNITS</p>
            <p><strong>Current CGPA:</strong> {cgpa}</p>
            <p><strong>Classification:</strong> <span style={{ fontWeight: 700, color: '#0b5394' }}>{degreeClass}</span></p>
            
            <div className="large-level-indicator">
              <h3>LEVEL</h3>
              <div className="level-number">{profile.level}</div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <table className="doc-table">
          <thead>
            <tr>
              <th className="col-code">COURSE CODE</th>
              <th className="col-title">COURSE TITLE</th>
              <th className="col-units">CREDIT LOAD</th>
              <th className="col-sem">SEMESTER</th>
              <th className="col-grade">GRADE</th>
              <th className="col-gp">GP</th>
            </tr>
          </thead>
          <tbody>
            {/* FIRST SEMESTER */}
            {isLoading ? <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading data...</td></tr> : firstSemester.map((c, i) => (
              <tr key={i}>
                <td className="col-code">{c.course_code}</td>
                <td className="col-title">{c.course_title}</td>
                <td className="col-units">{c.credit_units}</td>
                <td className="col-sem">FIRST</td>
                <td className="col-grade">{c.grade_letter}</td>
                <td className="col-gp">{c.gp.toFixed(1)}</td>
              </tr>
            ))}
            <tr className="subtotal-row">
              <td colSpan="2" className="text-right">========= FIRST SEMESTER TOTAL =========</td>
              <td className="col-units">{firstSemUnits} UNITS</td>
              <td colSpan="3"></td>
            </tr>

            {/* SECOND SEMESTER */}
            {secondSemester.map((c, i) => (
              <tr key={i}>
                <td className="col-code">{c.course_code}</td>
                <td className="col-title">{c.course_title}</td>
                <td className="col-units">{c.credit_units}</td>
                <td className="col-sem">SECOND</td>
                <td className="col-grade">{c.grade_letter}</td>
                <td className="col-gp">{c.gp.toFixed(1)}</td>
              </tr>
            ))}
            <tr className="subtotal-row">
              <td colSpan="2" className="text-right">========= SECOND SEMESTER TOTAL =========</td>
              <td className="col-units">{secondSemUnits} UNITS</td>
              <td colSpan="3"></td>
            </tr>

            {/* SESSION TOTAL */}
            <tr className="session-total-row">
              <td colSpan="2" className="text-right">========== SESSION'S TOTAL ==========</td>
              <td className="col-units">{totalUnits} UNITS</td>
              <td colSpan="2" className="text-right"><strong>CGPA:</strong></td>
              <td className="col-gp"><strong>{cgpa}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <div className="signatures">
          <div className="sig-line">
            <p>Course Adviser:........................................................................</p>
          </div>
          <div className="sig-line">
            <p>Student:........................................................................</p>
          </div>
        </div>

        <div className="footer-brand">
          <p>Powered by RISING LEGACY SYSTEMS</p>
        </div>

      </div>
    </div>
  );
}
