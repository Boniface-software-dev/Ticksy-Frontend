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
import AttendeeUpcoming from "./pages/attendees/AttUpcoming";
import LandingPage from "./pages/LandingPage";
import EventDetails from "./pages/EventDetails";
import AttendeePastEvents from "./pages/attendees/AttendeePastEvents";
import AttendeePastEventDetail from "./pages/attendees/AttendeePastEventDetail";
import AdminUserProfile from "./pages/admin/AdminUserProfile";
import CheckoutForm from "./pages/CheckoutForm";
import OrderConfirmation from "./pages/OrderConfirmation";

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

        <Route
        path="/order-confirmation"
        element={
          <ProtectedRoute roles={["attendee", "organizer"]}>
            <OrderConfirmation />
          </ProtectedRoute>
        }
        />        
        
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
          path="/organizer/:id/profile"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <OrgProfile />
            </ProtectedRoute>
          }
        />

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
        <Route
          path="/checkout"
          element={
          <ProtectedRoute roles={["attendee", "organizer"]}>
            <CheckoutForm />
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
