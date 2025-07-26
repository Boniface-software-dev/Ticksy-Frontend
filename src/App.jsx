import { Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import OrgProfile from "./pages/organizer/OrgProfile";
import Events from "./pages/events"
import EventsList from "./pages/EventsList";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/authentification/authSlice";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EventDetails from "./features/events/EventDetails";
import LandingPage from "./pages/LandingPage";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/admin/:id/profile" element={<OrgProfile />} />  
    <Route path="/events" element={<EventsList />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/events/:id" element={<EventDetails />} />
    <Route path="/" element={<LandingPage />} />
    
  </Routes>
);

}

export default App;
