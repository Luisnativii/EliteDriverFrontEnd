import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

// Definir roles y mapeo de rutas
const ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER'
};

const ROLE_ROUTE_MAP = {
  'ADMIN': 'admin',
  'CUSTOMER': 'customer'
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función de login simplificada para testing
  const login = async (role) => {
    try {
      setLoading(true);
      
      // Buscar usuario mock basado en el rol
      const mockUsers = authService.getMockUsers();
      const mockUser = mockUsers.find(u => u.role === role);
      
      if (!mockUser) {
        throw new Error('Rol no válido para testing');
      }

      // Hacer login con las credenciales del usuario mock
      const result = await authService.login(mockUser.email, mockUser.password);
      
      if (result && result.user) {
        const userData = {
          ...result.user,
          isAuthenticated: true,
          routeRole: ROLE_ROUTE_MAP[result.user.role] || 'customer'
        };
        
        setUser(userData);
        
        return {
          success: true,
          routeRole: userData.routeRole,
          user: userData
        };
      }
      
      throw new Error('Login failed');
      
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de login normal con email y password
  const loginWithCredentials = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      
      if (result && result.user) {
        const userData = {
          ...result.user,
          isAuthenticated: true,
          routeRole: ROLE_ROUTE_MAP[result.user.role] || 'customer'
        };
        
        setUser(userData);
        return {
          success: true,
          routeRole: userData.routeRole,
          user: userData
        };
      }
      
      throw new Error('Login failed');
      
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getUser();
          if (currentUser) {
            setUser({
              ...currentUser,
              isAuthenticated: true,
              routeRole: ROLE_ROUTE_MAP[currentUser.role] || 'customer'
            });
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    login,
    loginWithCredentials,
    logout,
    loading,
    ROLES,
    isAuthenticated: user?.isAuthenticated || false,
    isAdmin: user?.role === ROLES.ADMIN,
    isCustomer: user?.role === ROLES.CUSTOMER
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };