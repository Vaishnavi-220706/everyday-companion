// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import SelectSection from './pages/SelectSection';

import StudentDashboard from './pages/StudentDashboard';
import ElderDashboard from './pages/ElderDashboard';

import DeadlineTracker from './pages/DeadlineTracker';
import StudyPlanner from './pages/StudyPlanner';
import FocusTimer from './pages/FocusTimer';

import MedicineReminder from './pages/MedicineReminder';
import FoodChecklist from './pages/FoodChecklist';
import AppointmentTracker from './pages/AppointmentTracker';

// Components
import Navbar from './components/Navbar';


/*
Protected Route
- checks login
- checks selected role
*/
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const role = sessionStorage.getItem("selectedRole");

  // If role not selected yet → go to role page
  if (!role) return <Navigate to="/select-role" replace />;

  // If trying to access wrong role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/select-role" replace />;
  }

  return children;
};


const AppRoutes = () => {

  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={user ? <Navigate to="/select-role" /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/select-role" /> : <Register />}
        />



        {/* ROLE SELECTION */}

        <Route
          path="/select-role"
          element={
            user ? <SelectSection /> : <Navigate to="/login" />
          }
        />



        {/* STUDENT ROUTES */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/deadlines"
          element={
            <ProtectedRoute allowedRole="student">
              <DeadlineTracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/planner"
          element={
            <ProtectedRoute allowedRole="student">
              <StudyPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/timer"
          element={
            <ProtectedRoute allowedRole="student">
              <FocusTimer />
            </ProtectedRoute>
          }
        />



        {/* ELDER ROUTES */}

        <Route
          path="/elder"
          element={
            <ProtectedRoute allowedRole="elder">
              <ElderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/elder/medicine"
          element={
            <ProtectedRoute allowedRole="elder">
              <MedicineReminder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/elder/food"
          element={
            <ProtectedRoute allowedRole="elder">
              <FoodChecklist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/elder/appointments"
          element={
            <ProtectedRoute allowedRole="elder">
              <AppointmentTracker />
            </ProtectedRoute>
          }
        />



        {/* DEFAULT REDIRECT */}

        <Route
          path="/"
          element={
            user ? <Navigate to="/select-role" /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
};



function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;