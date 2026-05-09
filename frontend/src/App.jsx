import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import LecturerPortal from './pages/LecturerPortal';
import StudentPortal from './pages/StudentPortal';
import StudentPrint from './pages/StudentPrint';
import CourseRegistration from './pages/CourseRegistration';
import Students from './pages/admin/Students';
import Courses from './pages/admin/Courses';
import Transcripts from './pages/admin/Transcripts';
import AdminSettings from './pages/admin/AdminSettings';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/"                      element={<Navigate to="/login" replace />} />
          <Route path="/login"                 element={<Login />} />
          {/* Admin routes */}
          <Route path="/admin"                 element={<AdminDashboard />} />
          <Route path="/admin/students"        element={<Students />} />
          <Route path="/admin/courses"         element={<Courses />} />
          <Route path="/admin/transcripts"     element={<Transcripts />} />
          <Route path="/admin/settings"        element={<AdminSettings />} />
          {/* Lecturer routes */}
          <Route path="/lecturer"              element={<LecturerPortal />} />
          {/* Student routes */}
          <Route path="/student"               element={<StudentPortal />} />
          <Route path="/student/register"      element={<CourseRegistration />} />
          <Route path="/student/print"         element={<StudentPrint />} />
          <Route path="/student/transcripts"   element={<StudentPrint />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
