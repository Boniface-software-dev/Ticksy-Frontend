import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import AttendeeUpcomingEvents from "./pages/attendees/AttendeeUpcomingEvents";
import AttendeeUpcomingDetails from "./pages/attendees/AttUpcoming";
import LandingPage from "./pages/LandingPage";
import EventDetails from "./pages/EventDetails";
import AttendeePastEvents from "./pages/attendees/AttendeePastEvents";
import AttendeePastEventDetail from "./pages/attendees/AttendeePastEventDetail";
import AdminUserProfile from "./pages/admin/AdminUserProfile";

import UpcomingEvents from './pages/organizer/UpcomingPage';
import UpcomingDetails from './pages/organizer/UpcomingDetails';
import EventHistory from './pages/organizer/EventHistory';
import PendingEvents from './pages/organizer/PendingPage';
import RejectedEvents from './pages/organizer/RejectedPage';
import HistoryDetails from './pages/organizer/HistoryDetails';

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
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events" element={<EventsList />} />

        
        
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
              <AttendeeUpcomingEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendee/:id/past-events"
          element={
            <ProtectedRoute roles={["attendee"]}>
              <AttendeePastEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendee/:id/past-events/:eventId"
          element={
            <ProtectedRoute roles={["attendee"]}>
              <AttendeePastEventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendee/:id/upcoming-events/:eventId"
          element={
            <ProtectedRoute roles={["attendee"]}>
              <AttendeeUpcomingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/:id/profile"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <OrgProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/:id/dashboard"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <UpcomingEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/:id/events/:id"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <UpcomingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/:id/event-history"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <EventHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/:id/event-history/:id"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <HistoryDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/:id/pending-events"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <PendingEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/:id/rejected-events"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <RejectedEvents />
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

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
