import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";

const LoginTemp = () => {
  const { user, login, ROLES } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir a su dashboard
  if (user?.isAuthenticated) {
    return <Navigate to={`/${user.routeRole}`} replace />;
  }

  const handleLogin = async (role) => {
    try {
      const result = await login(role); // Ahora es asíncrono
      
      if (result.success) {
        navigate(`/${result.routeRole}`, { replace: true });
      } else {
        console.error("Error en login:", result.error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button 
        className="m-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
        onClick={() => handleLogin(ROLES.ADMIN)}
      >
        Login as Admin
      </button>
      <button 
        className="m-2 p-2 bg-green-500 text-white rounded hover:bg-green-600" 
        onClick={() => handleLogin(ROLES.CUSTOMER)}
      >
        Login as Customer
      </button>
    </div>
  );
};

export default LoginTemp;