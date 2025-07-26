import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import OrgProfile from "./pages/organizer/OrgProfile";
import Events from "./pages/events";
import EventsList from "./pages/EventsList";
import OrganizerDashboard from "./pages/organizer/OrgDashboard"; // ✅ fixed import path
import { useDispatch } from "react-redux";
import { loadUser } from "./features/authentification/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/:id/profile" element={<OrgProfile />} />
        <Route path="/events/:id" element={<Events />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/organizer/events" element={<OrganizerDashboard />} /> {/* ✅ fixed route */}
      </Routes>
    </Router>
  );
}

export default App;
