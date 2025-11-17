import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ authorized, children }) => {
  if (!authorized) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
