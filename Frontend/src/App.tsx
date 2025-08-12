import React, { useEffect } from "react";
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
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, restoreUser } = useAuth();

  useEffect(() => {
    restoreUser();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="*" element={<NotFound />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Guest-only */}
        <Route
          path="/my-bookings"
          element={
            <RoleBasedRoute allowedRoles={["guest", "host"]}>
              <MyBookings />
            </RoleBasedRoute>
          }
        />

        {/* Host-only */}
        <Route
          path="/host/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["host"]}>
              <HostDashboard user={user} />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/host/add-property"
          element={
            <RoleBasedRoute allowedRoles={["host"]}>
              <AddPropertyForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/host/edit/:id"
          element={
            <RoleBasedRoute allowedRoles={["host"]}>
              <EditPropertyForm />
            </RoleBasedRoute>
          }
        />

        {/* Protected Booking Invoice */}
        <Route
          path="/booking/:id/invoice"
          element={
            <RoleBasedRoute allowedRoles={["guest", "host"]}>
              <BookingInvoice />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
