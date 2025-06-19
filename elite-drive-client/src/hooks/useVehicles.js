// hooks/useVehicles.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getCurrentUser,
  isAuthenticated,
  hasAdminRole,
  testVehicleConnection
} from '../services/vehicleService';

// Hook principal para obtener todos los vehículos
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      console.log('🚗 Iniciando carga de vehículos...');
      setLoading(true);
      setError(null);

      const vehiclesData = await getAllVehicles();
      setVehicles(vehiclesData);

    } catch (err) {
      console.error('💥 Error en useVehicles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { 
    vehicles, 
    loading, 
    error, 
    refetch: fetchVehicles 
  };
};

// Hook para obtener un vehículo específico por ID
export const useVehicle = (id) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicle = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Cargando vehículo con ID:', id);
      setLoading(true);
      setError(null);

      const vehicleData = await getVehicleById(id);
      setVehicle(vehicleData);
      
    } catch (err) {
      console.error('💥 Error en useVehicle:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  return { 
    vehicle, 
    loading, 
    error,
    refetch: fetchVehicle
  };
};

// Hook para verificar autenticación y permisos
export const useAuthCheck = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    hasAdminRole: false,
    userInfo: null,
    loading: true
  });

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Verificando autenticación...');
      
      const authenticated = isAuthenticated();
      const adminRole = hasAdminRole();
      const userInfo = getCurrentUser();

      console.log('Token presente:', authenticated);
      console.log('Es admin:', adminRole);
      console.log('User info:', userInfo);

      setAuthStatus({
        isAuthenticated: authenticated,
        hasAdminRole: adminRole,
        userInfo: userInfo,
        loading: false
      });
    };

    checkAuth();
  }, []);

  return authStatus;
};

// Hook para operaciones CRUD de vehículos
export const useVehicleOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { hasAdminRole: userHasAdminRole } = useAuthCheck();

  // Función para crear vehículo
  const handleCreateVehicle = useCallback(async (vehicleData, onSuccess) => {
    try {
      setIsLoading(true);
      setErrors({});

      if (!userHasAdminRole) {
        throw new Error('No tienes permisos de administrador para crear vehículos');
      }

      console.log('➕ Creando vehículo:', vehicleData);
      const result = await createVehicle(vehicleData);
      
      // Ejecutar callback de éxito si se proporciona
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error creando vehículo:', error);
      setErrors({ create: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userHasAdminRole]);

  // Función para actualizar vehículo
  const handleUpdateVehicle = useCallback(async (id, updateData, onSuccess) => {
    try {
      setIsLoading(true);
      setErrors({});

      if (!userHasAdminRole) {
        throw new Error('No tienes permisos de administrador para actualizar vehículos');
      }

      console.log('✏️ Actualizando vehículo:', id, updateData);
      const result = await updateVehicle(id, updateData);
      
      // Ejecutar callback de éxito si se proporciona
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error actualizando vehículo:', error);
      setErrors({ update: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userHasAdminRole]);

  // Función para eliminar vehículo
  const handleDeleteVehicle = useCallback(async (id, onSuccess) => {
    try {
      setIsLoading(true);
      setErrors({});

      if (!userHasAdminRole) {
        throw new Error('No tienes permisos de administrador para eliminar vehículos');
      }

      console.log('🗑️ Eliminando vehículo:', id);
      const result = await deleteVehicle(id);
      
      // Ejecutar callback de éxito si se proporciona
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
      setErrors({ delete: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userHasAdminRole]);

  // Función para limpiar errores - CORREGIDA con useCallback
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    // Funciones de operaciones
    createVehicle: handleCreateVehicle,
    updateVehicle: handleUpdateVehicle,
    deleteVehicle: handleDeleteVehicle,
    
    // Estado
    isLoading,
    errors,
    hasAdminRole: userHasAdminRole,
    
    // Utilidades
    clearErrors,
    setErrors
  };
};

// Hook CORREGIDO para manejo de formularios de vehículos
export const useVehicleForm = (initialData = {}, isEditMode = false) => {
  const [formData, setFormData] = useState({
    // Campos que siempre se muestran
    name: '',
    brand: '',
    model: '',
    capacity: '',
    vehicleType: '', 
    pricePerDay: '',
    kilometers: '',
    features: [],
    image: null,
    ...initialData,
    // CORRECCIÓN: Manejar featuresText correctamente
    featuresText: (() => {
      if (initialData.features) {
        if (Array.isArray(initialData.features)) {
          return initialData.features.join(', ');
        } else if (typeof initialData.features === 'string') {
          return initialData.features;
        }
      }
      return '';
    })()
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Formateo especial para campos numéricos
    if (name === 'capacity' || name === 'kilometers') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
    // Formateo especial para precio
    else if (name === 'pricePerDay') {
      const numericValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error específico cuando el usuario empieza a escribir
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // En modo edición, solo validar campos editables
    if (isEditMode) {
      if (!formData.pricePerDay) {
        newErrors.pricePerDay = 'El precio por día es requerido';
      } else if (parseFloat(formData.pricePerDay) <= 0) {
        newErrors.pricePerDay = 'El precio debe ser mayor a 0';
      }

      if (!formData.kilometers) {
        newErrors.kilometers = 'Los kilómetros son requeridos';
      } else if (parseInt(formData.kilometers) < 0) {
        newErrors.kilometers = 'Los kilómetros no pueden ser negativos';
      }
    } else {
      // Validaciones completas para creación (mantener las existentes)
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre del vehículo es requerido';
      }

      if (!formData.brand.trim()) {
        newErrors.brand = 'La marca es requerida';
      }

      if (!formData.model.trim()) {
        newErrors.model = 'El modelo es requerido';
      }

      if (!formData.capacity) {
        newErrors.capacity = 'La capacidad es requerida';
      } else if (parseInt(formData.capacity) < 1 || parseInt(formData.capacity) > 50) {
        newErrors.capacity = 'La capacidad debe estar entre 1 y 50 personas';
      }

      if (!formData.vehicleType) {
        newErrors.vehicleType = 'El tipo de vehículo es requerido';
      }

      if (!formData.pricePerDay) {
        newErrors.pricePerDay = 'El precio por día es requerido';
      } else if (parseFloat(formData.pricePerDay) <= 0) {
        newErrors.pricePerDay = 'El precio debe ser mayor a 0';
      }

      if (!formData.kilometers) {
        newErrors.kilometers = 'Los kilómetros son requeridos';
      } else if (parseInt(formData.kilometers) < 0) {
        newErrors.kilometers = 'Los kilómetros no pueden ser negativos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditMode]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      capacity: '',
      vehicleType: '',
      pricePerDay: '',
      kilometers: '',
      features: [],
      image: null,
      ...initialData,
      featuresText: initialData.features ? initialData.features.join(', ') : ''
    });
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setErrors,
    setIsLoading
  };
};

// Hook para debug y testing
export const useVehicleDebug = () => {
  const testConnection = useCallback(async () => {
    try {
      console.log('🧪 Probando conexión con backend de vehículos...');
      const result = await testVehicleConnection();
      return result;
    } catch (error) {
      console.error('❌ Error en test de conexión:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }, []);

  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated();
    const adminRole = hasAdminRole();
    const userInfo = getCurrentUser();
    
    console.log('🔐 Estado de autenticación para vehículos:');
    console.log('- Autenticado:', authenticated ? 'SÍ' : 'NO');
    console.log('- Es Admin:', adminRole ? 'SÍ' : 'NO');
    console.log('- User Data:', userInfo);
    
    return {
      isAuthenticated: authenticated,
      hasAdminRole: adminRole,
      userInfo: userInfo
    };
  }, []);

  return {
    testConnection,
    checkAuth
  };
};