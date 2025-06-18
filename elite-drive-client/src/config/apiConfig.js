// config/apiConfig.js
export const API_BASE_URL = '/api'; // Cambiado: puerto 8080 y agregado /api
// export const API_BASE_URL = 'http://localhost:8080/api'; // URL completa para desarrollo

// Configuración de endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE: '/auth/validate'
  },
  VEHICLES: {
    GET_ALL: '/vehicles',
    GET_BY_ID: '/vehicles/:id',
    CREATE: '/vehicles',
    UPDATE: '/vehicles/:id',
    DELETE: '/vehicles/:id'
  },
  RESERVATIONS: {
    GET_ALL: '/reservations',
    GET_BY_USER: '/reservations/user/:userId',
    CREATE: '/reservations',
    UPDATE: '/reservations/:id',
    CANCEL: '/reservations/:id/cancel'
  }
};