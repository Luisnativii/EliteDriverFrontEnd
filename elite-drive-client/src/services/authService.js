// services/authService.js
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

// Configurar axios instance
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests - agregar token si existe
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url);
    console.log('Request headers:', config.headers);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores globalmente
authApi.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    console.log('Iniciando login para:', credentials.email);
    
    const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('Login response:', response.data);
    
    // Verificar que la respuesta tenga el formato esperado
    if (response.data && response.data.token && response.data.user) {
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      console.log('Login exitoso, datos guardados');
      return response.data;
    } else {
      console.error('Formato de respuesta inválido:', response.data);
      throw new Error('Formato de respuesta inválido del servidor');
    }
    
  } catch (error) {
    console.error('Error en login:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un error
      const message = error.response.data?.message || 'Error del servidor';
      throw new Error(message);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error('No se pudo conectar con el servidor. Verifica que esté ejecutándose.');
    } else {
      // Error en la configuración de la petición
      throw new Error(error.message || 'Error inesperado');
    }
  }
};

export const register = async (userData) => {
  try {
    console.log('Iniciando registro para:', userData.email);
    console.log('Datos a enviar:', userData);
    console.log('URL completa:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`);
    
    //const response = await authApi.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    
    //return response.data;
    const response = await axios.post('/api/auth/register', userData, {
        headers: {
            'Content-Type': 'application/json'
            // NO incluir Authorization aquí
        }
    });
    console.log('Registro exitoso:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error en registro - Detalles completos:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      requestData: error.config?.data
    });
    
    // Crear mensaje de error específico basado en el código de estado
    let errorMessage = 'Error al registrar usuario. Intenta nuevamente.';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 403:
          // Forbidden - puede ser por varios motivos
          if (data && typeof data === 'string') {
            errorMessage = data;
          } else if (data?.message) {
            errorMessage = data.message;
          } else if (data?.error) {
            errorMessage = data.error;
          } else {
            errorMessage = 'Acceso denegado. Verifica que todos los datos sean correctos.';
          }
          break;
          
        case 400:
          errorMessage = data?.message || 'Datos inválidos. Verifica la información ingresada.';
          break;
          
        case 409:
          errorMessage = data?.message || 'El usuario ya existe. Intenta con otro email o DUI.';
          break;
          
        case 422:
          errorMessage = data?.message || 'Error de validación. Revisa los datos ingresados.';
          break;
          
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
          
        default:
          errorMessage = data?.message || `Error del servidor (${status}).`;
      }
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose.';
    } else {
      errorMessage = error.message || 'Error inesperado';
    }
    
    throw new Error(errorMessage);
  }
};

export const logout = () => {
  console.log('Cerrando sesión');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const validateToken = async () => {
  try {
    const response = await authApi.get('/api/auth/validate');
    return response.data.valid;
  } catch (error) {
    console.error('Error validando token:', error);
    return false;
  }
};