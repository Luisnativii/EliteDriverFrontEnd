// components/forms/LoginForm.jsx
import React, { useState } from 'react';
import { login } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from 'react-router-dom';

const LoginForm = ({ onRegisterClick }) => {
  const { login: loginContext } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Authenticate with server via authService
      console.log('LoginForm - Iniciando autenticación...');
      const authData = await login(form);
      console.log('LoginForm - Datos recibidos del servidor:', authData);

      // Step 2: Update context with the authenticated user data
      console.log('LoginForm - Actualizando contexto...');
      const contextResult = await loginContext(authData);

      if (contextResult.success) {
        const redirectTo = location.state?.redirectTo;
        const userRole = authData.user?.role?.toLowerCase();
        console.log('LoginForm - Rol del usuario:', userRole);

        if (redirectTo) {
          console.log('Redirigiendo al destino guardado:', redirectTo);
          navigate(redirectTo, { replace: true });
        } else if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      } else {
        setError('Error al actualizar el contexto de usuario');
      }

    } catch (err) {
      console.error('LoginForm - Error en login:', err);
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Inicio de sesión</h2>
        <p className="text-white/70 text-sm">Ingresa tus credenciales</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-white/90 text-sm font-medium" htmlFor="email">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={form.email}
            className="w-full p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-white/90 text-sm font-medium" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={form.password}
            className="w-full p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mb-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 transform transition-all duration-300 shadow-lg ${isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:from-red-700 hover:to-red-800 hover:scale-[1.02]'
            }`}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/60">o</span>
          </div>
        </div>

        <button
          onClick={onRegisterClick}
          type="button"
          disabled={isLoading}
          className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
        >
          Crear nueva cuenta
        </button>
      </form>
    </div>
  );
};

export default LoginForm;