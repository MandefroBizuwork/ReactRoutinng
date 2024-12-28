import React, { useState, useRef } from 'react';
import "./register.css";
import { BaseURL } from '../axios/userURL';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate=useNavigate();
 const [userData,setUserdata]=useState()
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [errorr, seterrorr] = useState();

  const validateForm = () => {
    const errors = {};   
    if (!usernameRef.current.value.trim()) errors.username = 'Username is required';
    if (!passwordRef.current.value.trim()) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setMessage(null);
    seterrorr(null);

    const payload = {
     
      username: usernameRef.current.value.trim(),
      password: passwordRef.current.value.trim(),
    };

    try {
      const response = await BaseURL.post(`/user/login`, payload);
      if (response.status === 200) {
        setMessage(response.data.msg || "login successful!");      
        navigate("/dashboard")
      } else {
        seterrorr(response.data.msg || "Login failed. Please try again.");
      }
    //  setUserdata(response.data)
    localStorage.setItem("token",response.data.token)
     
      console.log (response.data.token)
    } catch (error) {
      console.error('Error:', error);
      seterrorr(error.response?.data?.msg || "Internal server error !");
    } finally {
      setIsSubmitting(false);
    }
  };
  function closeAlert(){
    setMessage("")
    seterrorr("")

  }
  return (
    <div className='container-fluid bg-light mt-5 py-4 shadow'>
      <div className='container row'>
        <div className="container col-6">
          {errorr && (
            <div style={{color:errorr?"red":"black"}} className="alert alert-success alert-dismissible fade show" role="alert">
             {errorr}
              <button onClick={closeAlert} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}
          {message && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {message}
              <button  onClick={closeAlert} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
          
            <div className="mb-2">
              <label htmlFor="username">Username:</label>
              <input className="form-control" type="text" ref={usernameRef} />
              {formErrors.username && <p className="text-danger">{formErrors.username}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="password">Password:</label>
              <input className="form-control" type="password" ref={passwordRef} />
              {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
            </div>
            <button className="btn btn-success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
