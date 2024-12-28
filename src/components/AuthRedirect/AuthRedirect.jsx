import { AppState } from "../../App";
import React,{useContext} from "react";
import { Navigate } from "react-router-dom";
function AuthRedirect({ children }) {
    const { user } = useContext(AppState);
  const isLoggedIn=!!user
    if(isLoggedIn) {
      return <Navigate to="/dashboard" />;
    }   
    return children;
  }
  export default AuthRedirect