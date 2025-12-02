import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Checking Authentication...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
