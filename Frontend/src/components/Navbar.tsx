import React from "react";
import { Link } from "react-router-dom";
import "../style/Navbar.css";

interface NavbarProps {
  user: { name: string; role: string } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">StayFinder 🏡</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              {user.role === "host" && (
                <Link to="/host/dashboard">Host Dashboard</Link>
              )}

              <span className="user-name">Hi, {user.name}</span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
