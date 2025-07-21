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
import BookingInvoice from "./pages/BookingConfirmation";
import EditPropertyForm from "./pages/EditPropertyForm";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import { User } from "./types/User";
import NotFound from "./pages/NotFound";

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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="*" element={<NotFound />} />

        {/* Auth Routes (login/signup) */}

        <>
          <Route
            path="/login"
            element={
              <LoginForm
                onLogin={handleAuthSuccess}
                switchToSignup={() => setShowSignup(true)}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignupForm
                onSignup={handleAuthSuccess}
                switchToLogin={() => setShowSignup(false)}
              />
            }
          />
        </>

        {/* Guest-only Route */}
        <Route
          path="/my-bookings"
          element={
            <RoleBasedRoute user={user} allowedRoles={["guest"]}>
              <MyBookings />
            </RoleBasedRoute>
          }
        />

        {/* Host-only Routes */}
        <Route
          path="/host/dashboard"
          element={
            <RoleBasedRoute user={user} allowedRoles={["host"]}>
              <HostDashboard user={user!} />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/host/add-property"
          element={
            <RoleBasedRoute user={user} allowedRoles={["host"]}>
              <AddPropertyForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/host/edit/:id"
          element={
            <RoleBasedRoute user={user} allowedRoles={["host"]}>
              <EditPropertyForm />
            </RoleBasedRoute>
          }
        />

        {/* Protected Booking Invoice (both guest/host can view) */}
        <Route
          path="/booking/:id/invoice"
          element={
            <RoleBasedRoute user={user} allowedRoles={["guest", "host"]}>
              <BookingInvoice />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
