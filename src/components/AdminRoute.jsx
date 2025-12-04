import { Navigate } from "react-router-dom";

export default function AdminRoute({ authorized,user, children }) {

  if (!authorized) return <Navigate to="/" replace />;
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
