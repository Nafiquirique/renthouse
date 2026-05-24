import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, tiposPermitidos }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (tiposPermitidos && !tiposPermitidos.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;