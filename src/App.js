import logo from "./logo.svg";
import "./App.css";
import "./css/bootstrap-5/css/bootstrap.min.css";
import ContactForm from "./components/Mailer/Mailer";
import Register from "./components/user/Register";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/user/Login";
import Layout from "./components/SharedLayout/Layout";
import Dashboard from "./components/user/Dashboard";
import { BaseURL } from "./components/axios/userURL";
import { createContext, useEffect, useState } from "react";
import AuthRedirect from "./components/AuthRedirect/AuthRedirect";
import ProtectedRoute from "./components/AuthRedirect/ProtectedRoute";
import FileUpload from "./components/Document/FileUpload";

export const AppState = createContext();

function App() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState();
  async function checkAuth() {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await BaseURL.get("/user/checkuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error(
        "Error during authentication:",
        error.response?.data || error.message
      );
      navigate("/login");
    }
  }

  useEffect(() => {
    checkAuth();
  }, [token]);
  function logout() {
    localStorage.removeItem("token"); // Remove the token
    setUser(null); // Clear the user state
    navigate("/login"); // Redirect to login page
  }
  return (
    <Layout>
      <AppState.Provider value={{ user, setUser,logout }}>
        <Routes>
          <Route path="/" element={<h1>Welcome home page</h1>} />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
           <Route
            path="/documents"
            element={ <FileUpload/>}
          />
          
        </Routes>
      </AppState.Provider>
    </Layout>
   
  );
}

export default App;
