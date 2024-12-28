import React, { useContext } from "react";
import { AppState } from "../../App"; // Ensure correct path to App.js
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useContext(AppState); // Destructure `user` from AppState context

  // Check if the user is logged in
  const isLoggedIn = !!user; // User is logged in if `user` is not null or undefined

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
