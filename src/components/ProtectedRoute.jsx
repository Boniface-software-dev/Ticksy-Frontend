import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roles, children, redirectTo = "/unauthorized", fallbackToLogin = true }) {
  const user = useSelector((state) => state.auth.currentUser);

  if (!user) {
    return fallbackToLogin ? <Navigate to="/login" replace /> : <Navigate to={redirectTo} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}