import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authentification/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    dispatch(login({ email, password })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        const user = action.payload;

        if (user.token) {
          localStorage.setItem("accessToken", user.token);
        }

        if (!user.role || !user.id) {
          console.error("User data incomplete:", user);
          return;
        }

        // 👇 FIX: redirect attendee to their proper dashboard
        if (user.role === "attendee") {
          navigate(`/events`);
        } else {
          navigate(`/${user.role}/${user.id}/dashboard`);
        }
      } else {
        setError("Invalid email or password.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-lg p-8 space-y-6 relative">
        {/* Loading overlay (optional)
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )} */}

        <div className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-purple-500" />
          <h2 className="mt-4 text-2xl font-bold text-purple-500">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-gray-500">Login</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 text-black">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-400 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-purple-600 transition duration-300 shadow disabled:bg-purple-400"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-purple-600 font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
