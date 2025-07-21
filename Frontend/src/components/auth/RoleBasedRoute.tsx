import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactElement;
  user: { role: string } | null;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children, user, allowedRoles }: Props) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
      <h2>🚫 Access Denied</h2>
      <p>You do not have permission to access this page.</p>
    </div>;
  }

  return children;
};

export default RoleBasedRoute;
