import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Validación segura del usuario y rol
  const tieneAcceso =
    user &&
    typeof user === 'object' &&
    user.role &&
    user.role === requiredRole;

  if (!tieneAcceso) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default ProtectedRoute;