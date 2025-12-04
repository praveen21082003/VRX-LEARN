import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ authorized, user, children }) => {
  if (!authorized) {
    return <Navigate to="/" replace />;
  }
  if (user?.role !== "trainee") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
