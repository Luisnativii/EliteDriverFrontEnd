import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();


  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, redirigir al login
  if (!user || !user.isAuthenticated) {
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole) {
    const userRouteRole = user.routeRole; // "admin" o "customer"
    
    console.log("Verificando rol - Requerido:", requiredRole, "Usuario tiene:", userRouteRole);
    
    if (userRouteRole !== requiredRole) {
      console.log("Rol no coincide, redirigiendo a:", `/${userRouteRole}`);
      // Redirigir al dashboard correspondiente al rol del usuario
      return <Navigate to={`/${userRouteRole}`} replace />;
    }
  }

  console.log("Acceso permitido");
  
  // Si hay children, renderizar children, si no, renderizar Outlet para nested routes
  return children || <Outlet />;
};

export default ProtectedRoute;