import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  // Placeholder for events and state we'll add later
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <div className="font-sans">
      {/* Sections will be added here one by one */}
    </div>
  );
};

export default LandingPage;
