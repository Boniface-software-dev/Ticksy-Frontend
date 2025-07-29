import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import EventsList from "./pages/EventsList";

import AttendeeProfile from "./pages/attendees/AttendeeProfile";
import OrgProfile from "./pages/organizer/OrgProfile";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
// import OrgDashboard from './pages/organizer/OrgDashboard';

import AttendeeUpcoming from "./pages/attendees/AttUpcoming";
import LandingPage from "./pages/LandingPage";
import EventDetails from "./pages/EventDetails";

import AdminUserProfile from "./pages/admin/AdminUserProfile";

// ...imports

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id/tickets" element={<EventDetails />} />
        

        {/* Attendee Protected Routes */}
        <Route
          path="/attendee/:id/profile"
          element={
            <ProtectedRoute roles={["attendee"]}>
              <AttendeeProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendee/:id/upcoming-events"
          element={
            <ProtectedRoute roles={["attendee"]}>
              <AttendeeUpcoming />
            </ProtectedRoute>
          }
        />

        {/* Organizer Protected Routes
        <Route path="/organizer/:id/dashboard" element={
            <ProtectedRoute roles={['organizer']}>
              <OrgDashboard />
            </ProtectedRoute> */}
        {/* } */}
        {/* /> */}
        <Route
          path="/organizer/:id/profile"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <OrgProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/:id/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:id/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:id/events"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:id/analytics"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:id/profile"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:adminId/users/:userId"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUserProfile />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch-all: Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
