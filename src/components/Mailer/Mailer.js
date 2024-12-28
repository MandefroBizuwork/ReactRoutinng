// ContactForm.js
import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.message) errors.message = "Message is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    // Send POST request to Node.js backend
    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData) // Corrected JSON.stringify usage
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        alert(data.message); // Corrected to use data.message
        setFormData({ name: '', email: '', message: '' }); // Reset the form
      }
    } catch (error) {
      alert('Failed to send message. Please try again later.');
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container'>
      {isSuccess && <p>Message sent successfully!</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="name">Name:</label>
          <input
            className="form-control" 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <p className="error">{formErrors.name}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control" 
          />
          {formErrors.email && <p className="error">{formErrors.email}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="message">Message:</label>
          <textarea
            value={formData.message}
            onChange={handleChange}
            name="message"
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
          {formErrors.message && <p className="error">{formErrors.message}</p>}
        </div>

        <button className='btn btn-success' type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
