import { Navigate } from "react-router-dom";

export default function AdminRoute({ authorized, children }) {

  if (!authorized) return <Navigate to="/login" replace />;
  return children;
}
