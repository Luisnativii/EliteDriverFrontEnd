// services/vehicleService.js
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

// Configurar axios instance para vehículos
const vehicleApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests - agregar token si existe
vehicleApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken') || 
                  localStorage.getItem('authToken') || 
                  window.authToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token agregado al header de vehículos');
    } else {
      console.warn('⚠️ No se encontró token de autenticación para vehículos');
    }
    
    console.log('🚀 Realizando petición a:', config.url);
    console.log('📤 Datos enviados:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor request de vehículos:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores globalmente
vehicleApi.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa de vehículos:', response.status);
    console.log('📥 Datos recibidos:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de vehículos:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      requestData: error.config?.data
    });
    
    if (error.response?.status === 401) {
      console.warn('🔒 Token expirado, limpiando datos de autenticación');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
      localStorage.removeItem('userData');
    }
    
    if (error.response?.status === 403) {
      console.error('🚫 Acceso prohibido - Verificar permisos de usuario');
    }
    
    return Promise.reject(error);
  }
);

// Función CORREGIDA para transformar datos de la API al formato del frontend
const transformVehicleData = (apiVehicle) => {
  console.log('🔄 Transformando vehículo desde API:', apiVehicle);
  
  return {
    id: apiVehicle.id,
    name: apiVehicle.name,
    brand: apiVehicle.brand,
    model: apiVehicle.model,
    capacity: apiVehicle.capacity,
    type: apiVehicle.vehicleType?.type || 'Desconocido',
    vehicleType: apiVehicle.vehicleType?.type || 'Desconocido',
    price: parseFloat(apiVehicle.pricePerDay),
    pricePerDay: parseFloat(apiVehicle.pricePerDay),
    kilometers: apiVehicle.kilometers,
    kmForMaintenance: apiVehicle.kmForMaintenance || null, // <- agregado
    features: apiVehicle.features || [],
    image: apiVehicle.mainImageUrl || null,
     imageUrls: apiVehicle.imageUrls || [],
     status: apiVehicle.status || 'available'
  };
};

// Función CORREGIDA para transformar datos del frontend al formato de la API
const transformVehicleForAPI = (vehicleData) => {
  console.log('🔄 Transformando vehículo para API:', vehicleData);
  
  // Procesar features de manera más robusta
  let processedFeatures = [];
  if (vehicleData.features) {
    if (Array.isArray(vehicleData.features)) {
      processedFeatures = vehicleData.features.filter(f => f && typeof f === 'string' && f.trim() !== '');
    } else if (typeof vehicleData.features === 'string') {
      processedFeatures = vehicleData.features.split(',').map(f => f.trim()).filter(f => f !== '');
    }
  }
  
  // Validar datos requeridos antes de crear el objeto
  const name = vehicleData.name?.toString().trim();
  const brand = vehicleData.brand?.toString().trim();
  const model = vehicleData.model?.toString().trim();
  const capacity = parseInt(vehicleData.capacity);
  const pricePerDay = parseFloat(vehicleData.pricePerDay || vehicleData.price);
  const kilometers = parseInt(vehicleData.kilometers);
  const vehicleType = vehicleData.vehicleType || vehicleData.type;
  
  // Validar que todos los campos requeridos estén presentes
  if (!name || !brand || !model || isNaN(capacity) || isNaN(pricePerDay) || isNaN(kilometers) || !vehicleType) {
    console.error('❌ Datos incompletos:', { name, brand, model, capacity, pricePerDay, kilometers, vehicleType });
    throw new Error('Todos los campos son requeridos y deben tener valores válidos');
  }

  const apiData = {
  name,
  brand,
  model,
  capacity,
  pricePerDay,
  kilometers,
  kmForMaintenance: parseInt(vehicleData.kmForMaintenance),
  features: processedFeatures,
  vehicleType: {
    type: vehicleType
  },
  mainImageUrl: vehicleData.mainImageUrl,
  imageUrls: Array.isArray(vehicleData.imageUrls)
    ? vehicleData.imageUrls
    : (vehicleData.imageUrlsText || '').split(',').map(x => x.trim()).filter(x => x !== '')
};

  
  console.log('📤 Datos transformados para API:', apiData);
  return apiData;
};

const transformVehicleForUpdate = (vehicleData) => {
  console.log('🔄 Transformando vehículo para actualización (campos permitidos):', vehicleData);
  
  // Procesar features de manera más robusta
  let processedFeatures = [];
  if (vehicleData.features) {
    if (Array.isArray(vehicleData.features)) {
      processedFeatures = vehicleData.features.filter(f => f && typeof f === 'string' && f.trim() !== '');
    } else if (typeof vehicleData.features === 'string') {
      processedFeatures = vehicleData.features.split(',').map(f => f.trim()).filter(f => f !== '');
    }
  }
  
  // Procesar imageUrls si viene como array o string
  let processedImageUrls = [];
  if (vehicleData.imageUrls) {
    if (Array.isArray(vehicleData.imageUrls)) {
      processedImageUrls = vehicleData.imageUrls.filter(url => url && typeof url === 'string' && url.trim() !== '');
    } else if (typeof vehicleData.imageUrls === 'string') {
      processedImageUrls = vehicleData.imageUrls.split(',').map(url => url.trim()).filter(url => url !== '');
    }
  }
  
  // Validar campos requeridos
  const pricePerDay = parseFloat(vehicleData.pricePerDay || vehicleData.price);
  const kilometers = parseInt(vehicleData.kilometers);
  
  if (isNaN(pricePerDay) || isNaN(kilometers)) {
    console.error('❌ Datos incompletos para actualización:', { pricePerDay, kilometers });
    throw new Error('Precio por día y kilómetros son requeridos para la actualización');
  }
  
  const updateData = {
    pricePerDay,
    kilometers,
    features: processedFeatures,
    mainImageUrl: vehicleData.mainImageUrl || null,
    imageUrls: processedImageUrls
  };
  
  console.log('📤 Datos transformados para actualización:', updateData);
  return updateData;
};

// Servicios principales
export const getAllVehicles = async () => {
  try {
    console.log('🚗 Obteniendo todos los vehículos...');
    
    const response = await vehicleApi.get(API_ENDPOINTS.VEHICLES.GET_ALL);
    console.log('📋 Respuesta completa del servidor:', response);
    console.log('📋 Datos de vehículos recibidos:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.error('❌ La respuesta no es un array:', typeof response.data, response.data);
      throw new Error('La respuesta no es un array válido');
    }
    
    const transformedVehicles = response.data.map(transformVehicleData);
    console.log('✨ Vehículos transformados:', transformedVehicles);
    
    return transformedVehicles;
    
  } catch (error) {
    console.error('💥 Error obteniendo vehículos:', error);
    
    // Crear mensaje de error específico
    let errorMessage = 'Error al cargar los vehículos';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Petición incorrecta. Verifica la configuración de la API.';
          console.error('📋 Detalles del error 400:', data);
          break;
        case 401:
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'No tienes permisos para ver los vehículos. Verifica tu autenticación.';
          break;
        case 404:
          errorMessage = 'Servicio de vehículos no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = data?.message || `Error del servidor (${status}).`;
          console.error('📋 Error no manejado:', { status, data });
      }
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose.';
      console.error('📋 Error de conexión:', error.request);
    } else {
      errorMessage = error.message || 'Error inesperado';
      console.error('📋 Error desconocido:', error);
    }
    
    throw new Error(errorMessage);
  }
};

export const getVehicleById = async (id) => {
  try {
    console.log('🔍 Buscando vehículo con ID:', id);
    
    const endpoint = API_ENDPOINTS.VEHICLES.GET_BY_ID.replace(':id', id);
    
    try {
      const response = await vehicleApi.get(endpoint);
      return transformVehicleData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('🔄 Endpoint directo no disponible, buscando en lista completa...');
        const allVehicles = await getAllVehicles();
        const foundVehicle = allVehicles.find(v => v.id === id);
        
        if (!foundVehicle) {
          throw new Error('Vehículo no encontrado');
        }
        
        return foundVehicle;
      }
      throw error;
    }
    
  } catch (error) {
    console.error('💥 Error obteniendo vehículo por ID:', error);
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Error al cargar el vehículo';
    throw new Error(errorMessage);
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    console.log('➕ Creando vehículo:', vehicleData);
    
    const apiData = transformVehicleForAPI(vehicleData);
    console.log('📤 Enviando datos a API:', apiData);
    
    const response = await vehicleApi.post(API_ENDPOINTS.VEHICLES.CREATE, apiData);
    console.log('✅ Vehículo creado exitosamente:', response.data);
    
    // Si el backend devuelve datos, transformarlos
    if (response.data) {
      return transformVehicleData(response.data);
    }
    
    // Si no devuelve datos, devolver los datos originales con un ID simulado
    return { ...vehicleData, id: 'created-successfully' };
    
  } catch (error) {
    console.error('💥 Error creando vehículo:', error);
    
    let errorMessage = 'Error al crear el vehículo';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Datos inválidos. Verifica la información ingresada.';
          console.error('📋 Detalles del error 400:', data);
          break;
        case 401:
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'No tienes permisos de administrador para crear vehículos.';
          break;
        case 409:
          errorMessage = data?.message || 'Ya existe un vehículo con esos datos.';
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

export const updateVehicle = async (id, updateData) => {
  try {
    console.log('✏️ Actualizando vehículo:', id, updateData);
    
    const endpoint = API_ENDPOINTS.VEHICLES.UPDATE.replace(':id', id);
    
    // Usar la función específica para updates que solo envía campos permitidos
    const apiData = transformVehicleForUpdate(updateData);
    
    const response = await vehicleApi.put(endpoint, apiData);
    console.log('✅ Vehículo actualizado exitosamente');
    
    return response.data ? transformVehicleData(response.data) : { success: true };
    
  } catch (error) {
    console.error('💥 Error actualizando vehículo:', error);
    
    let errorMessage = 'Error al actualizar el vehículo';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Datos inválidos. Solo se pueden actualizar precio, kilómetros y características.';
          break;
        case 401:
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'No tienes permisos de administrador para actualizar vehículos.';
          break;
        case 404:
          errorMessage = 'Vehículo no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = data?.message || `Error del servidor (${status}).`;
      }
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor.';
    } else {
      errorMessage = error.message || 'Error inesperado';
    }
    
    throw new Error(errorMessage);
  }
};

export const deleteVehicle = async (id) => {
  try {
    console.log('🗑️ Eliminando vehículo:', id);
    
    const endpoint = API_ENDPOINTS.VEHICLES.DELETE.replace(':id', id);
    await vehicleApi.delete(endpoint);
    console.log('✅ Vehículo eliminado exitosamente');
    
    return { success: true };
    
  } catch (error) {
    console.error('💥 Error eliminando vehículo:', error);
    
    let errorMessage = 'Error al eliminar el vehículo';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'No tienes permisos de administrador para eliminar vehículos.';
          break;
        case 404:
          errorMessage = 'Vehículo no encontrado.';
          break;
        case 409:
          errorMessage = 'No se puede eliminar el vehículo porque tiene reservas asociadas.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = data?.message || `Error del servidor (${status}).`;
      }
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor.';
    } else {
      errorMessage = error.message || 'Error inesperado';
    }
    
    throw new Error(errorMessage);
  }
};

// Funciones de utilidad para autenticación
export const getCurrentUser = () => {
  const userData = sessionStorage.getItem('userData') || 
                   localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  return !!(sessionStorage.getItem('authToken') || 
           localStorage.getItem('authToken'));
};

export const hasAdminRole = () => {
  const user = getCurrentUser();
  return user && (user.role === 'ADMIN' || user.roles?.includes('ADMIN'));
};

// Función de debug para testing
export const testVehicleConnection = async () => {
  try {
    console.log('🧪 Probando conexión con servicio de vehículos...');
    const vehicles = await getAllVehicles();
    console.log('✅ Conexión exitosa con servicio de vehículos');
    return { success: true, count: vehicles.length };
  } catch (error) {
    console.error('❌ Error de conexión con servicio de vehículos:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};