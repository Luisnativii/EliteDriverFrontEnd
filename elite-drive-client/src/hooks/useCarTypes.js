// Add this hook to your useVehicles.js file

// Hook para obtener tipos de vehículos
export const useCarTypes = () => {
  const [carTypes, setCarTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCarTypes = async () => {
    try {
      console.log('🏷️ Iniciando carga de tipos de vehículos...');
      setLoading(true);
      setError(null);

      // Ajusta esta URL según tu endpoint de tipos de vehículos
      const response = await vehicleApi.get('/car-types'); // o '/cartypes' según tu API
      console.log('📋 Tipos de vehículos recibidos:', response.data);
      
      if (!Array.isArray(response.data)) {
        throw new Error('La respuesta no es un array válido');
      }
      
      setCarTypes(response.data);

    } catch (err) {
      console.error('💥 Error fetching car types:', err);
      
      let errorMessage;
      if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para ver los tipos de vehículos.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (err.response?.status === 404) {
        // Si no existe el endpoint, usar datos por defecto
        console.warn('⚠️ Endpoint de tipos no encontrado, usando datos por defecto');
        setCarTypes([
          { type: 'Sedán' },
          { type: 'SUV' },
          { type: 'Hatchback' },
        ]);
        setError(null);
        setLoading(false);
        return;
      } else {
        errorMessage = err.response?.data?.message || 
                      err.message || 
                      'Error al cargar los tipos de vehículos';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarTypes();
  }, []);

  return { 
    carTypes, 
    loading, 
    error, 
    refetch: fetchCarTypes 
  };
};