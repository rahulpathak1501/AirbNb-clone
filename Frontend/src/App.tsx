import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyDetail from "./components/PropertyDetails";
import Navbar from "./components/Navbar";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import MyBookings from "./pages/MyBookings";
import HostDashboard from "./pages/HostDashboard";
import AddPropertyForm from "./pages/AddPropertyForm";

interface User {
  name: string;
  email: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowSignup(false);
  };

  const handleAuthSuccess = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      {user ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route
            path="/host/dashboard"
            element={<HostDashboard user={user} />}
          />
          <Route path="/host/add-property" element={<AddPropertyForm />} />
        </Routes>
      ) : showSignup ? (
        <SignupForm
          onSignup={handleAuthSuccess}
          switchToLogin={() => setShowSignup(false)}
        />
      ) : (
        <LoginForm
          onLogin={handleAuthSuccess}
          switchToSignup={() => setShowSignup(true)}
        />
      )}
    </>
  );
}

export default App;
