import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import EventsList from './pages/EventsList';
import LandingPage from './pages/LandingPage';
import EventDetails from './pages/EventDetails';

import Login from './pages/Login';
import Register from "./pages/Register";

import Unauthorized from './pages/Unauthorized';

import AttendeeProfile from './pages/attendees/AttendeeProfile';
import AttendeeUpcoming from './pages/attendees/AttendeeUpcomingEvents';

import OrgProfile from './pages/organizer/OrgProfile';
import AdminProfile from './pages/admin/AdminProfile';
import MyOrders from './pages/attendees/MyOrders';

// import OrgDashboard from './pages/organizer/OrgDashboard'; // If needed later

function ProtectedRoute({ children, roles }) {
  const user = useSelector((state) => state.auth.currentUser);

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Unauthorized />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Attendee Protected Routes */}
        <Route
          path="/attendee/:id/profile"
          element={
            <ProtectedRoute roles={['attendee']}>
              <AttendeeProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendee/:id/upcoming-events"
          element={
            <ProtectedRoute roles={['attendee']}>
              <AttendeeUpcoming />
            </ProtectedRoute>
          }
        />
        <Route
  path="/attendee/:id/orders"
  element={
    <ProtectedRoute roles={['attendee']}>
      <MyOrders />
    </ProtectedRoute>
  }
/>


        {/* Organizer Protected Routes */}
        <Route
          path="/organizer/:id/profile"
          element={
            <ProtectedRoute roles={['organizer']}>
              <OrgProfile />
            </ProtectedRoute>
          }
        />
        {/* 
        <Route
          path="/organizer/:id/dashboard"
          element={
            <ProtectedRoute roles={['organizer']}>
              <OrgDashboard />
            </ProtectedRoute>
          }
        />
        */}

        {/* Admin Protected Routes */}
        <Route
          path="/admin/:id/profile"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback: Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
