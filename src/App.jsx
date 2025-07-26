import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import OrgProfile from "./pages/organizer/OrgProfile";
import Events from "./pages/events";
import EventsList from "./pages/EventsList";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/authentification/authSlice";

function App() {
  const dispatch  = useDispatch();

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
        
      </Routes>
    </Router>
  );
}

export default App;

