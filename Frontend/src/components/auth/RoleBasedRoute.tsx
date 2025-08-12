import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: React.ReactElement;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div
        className="unauthorized"
        style={{ padding: "2rem", textAlign: "center", color: "red" }}
      >
        <h2>🚫 Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;
