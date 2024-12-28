import React, { useState, useRef } from 'react';
import "./register.css";
import { BaseURL } from '../axios/userURL';
import { Link } from 'react-router-dom';

function Register() {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [errorr, seterrorr] = useState();

  const validateForm = () => {
    const errors = {};
    if (!firstnameRef.current.value.trim()) errors.firstname = 'First name is required';
    if (!lastnameRef.current.value.trim()) errors.lastname = 'Last name is required';
    if (!emailRef.current.value.trim()) errors.email = 'Email is required';
    if (emailRef.current.value && !/\S+@\S+\.\S+/.test(emailRef.current.value))
      errors.email = 'Invalid email format';
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
      firstname: firstnameRef.current.value.trim(),
      lastname: lastnameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      username: usernameRef.current.value.trim(),
      password: passwordRef.current.value.trim(),
    };

    try {
      const response = await BaseURL.post(`/user/register`, payload);
      if (response.status === 201) {
        setMessage(response.data.msg || "Registration successful!");
        firstnameRef.current.value = '';
        lastnameRef.current.value = '';
        emailRef.current.value = '';
        usernameRef.current.value = '';
        passwordRef.current.value = '';
      } else {
        seterrorr(response.data.msg || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      seterrorr(error.response?.data?.msg || "Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  };
  function closeAlert(){
    setMessage("")
    seterrorr("")

  }
  return (
    <div className='container-fluid bg-light py-4' style={{marginTop:"70px"}}>
      <div className='container row'>
        <div className="container col-6">
          {errorr && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorr}
              <button type="button" onClick={closeAlert} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}
          {message && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <div className="d-flex gap-3">
              {message}
              <Link to="/login">Login here</Link>
              </div>
              <button type="button" onClick={closeAlert} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
           
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-2">
              <label htmlFor="firstname">First Name:</label>
              <input className="form-control" type="text" ref={firstnameRef} />
              {formErrors.firstname && <p className="text-danger">{formErrors.firstname}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="lastname">Last Name:</label>
              <input className="form-control" type="text" ref={lastnameRef} />
              {formErrors.lastname && <p className="text-danger">{formErrors.lastname}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="email">Email Address:</label>
              <input className="form-control" type="email" ref={emailRef} />
              {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
            </div>
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
