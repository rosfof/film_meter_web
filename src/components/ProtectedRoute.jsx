import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default ProtectedRoute;