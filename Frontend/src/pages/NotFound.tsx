import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/ErrorPage.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="error-title">404 - Page Not Found</h1>
      <p className="error-message">
        Oops! The page you're looking for doesn't exist or was moved.
      </p>
      <button onClick={() => navigate("/")} className="home-button">
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
