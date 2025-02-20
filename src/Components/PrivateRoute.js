import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/auth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/home" />;
};

export default PrivateRoute;
