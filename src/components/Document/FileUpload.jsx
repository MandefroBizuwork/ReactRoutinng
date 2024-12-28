import React, { useState, useRef } from "react";
import axios from "axios";
import { BaseURL } from '../axios/userURL';
function FileUpload() {
  const fileData = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    if (!fileData.current?.files[0]) {
      setError("Please select a file to upload.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", fileData.current.files[0]);

    try {
      const response = await BaseURL.post(
        `http://localhost:2000/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  console.log(response.data)
      if (response.status===200) {
        setMessage(response.data.message);
        setFileName(null); // Clear file name
        fileData.current.value = ""; // Reset file input
      } else {
        setError(response.data.message || "Failed to upload file.");
      }
    } catch (err) {
      console.error(err.message);
      setError(
        err.response?.data?.message || "An error occurred while uploading."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = () => {
    const file = fileData.current.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const closeAlert = () => {
    setMessage("");
    setError("");
  };

  return (
    <div className="container-fluid bg-light mt-5 py-4 shadow">
      <div className="container row">
        <div className="container col-6">
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                onClick={closeAlert}
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
          {message && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {message}
              <button
                onClick={closeAlert}
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="file">Choose file:</label>
              <input
                className="form-control"
                type="file"
                id="file"
                ref={fileData}
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              {fileName && (
                <small className="text-muted">Selected file: {fileName}</small>
              )}
            </div>

            <button
              className="btn btn-success"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
