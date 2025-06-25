import { useState, useCallback, useEffect } from 'react';
import { useVehicles, useAuthCheck, useVehicleOperations } from './useVehicles';
import ReservationService from '@/services/reservationService';

export const useVehicleManagement = () => {
  // Hooks externos
  const { vehicles, loading, error, refetch } = useVehicles();
  const { hasAdminRole, isAuthenticated, loading: authLoading } = useAuthCheck();
  const { createVehicle, updateVehicle, isLoading: operationLoading } = useVehicleOperations();
  
  // Estados del componente
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

  // Función para obtener reservaciones del día actual
  const fetchTodayReservations = useCallback(async () => {
    try {
      setReservationsLoading(true);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

      const reservationsData = await ReservationService.getReservationsByDateRange(todayStr, todayStr);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error al cargar reservaciones:', error);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      fetchTodayReservations();
    }
  }, [vehicles, fetchTodayReservations]);

  // Función para obtener vehículos reservados hoy
  const getReservedVehicleIds = useCallback(() => {
    return reservations.map(reservation => reservation.vehicle?.id).filter(Boolean);
  }, [reservations]);

  // Función para determinar el estado efectivo de un vehículo
  const getEffectiveVehicleStatus = useCallback((vehicle) => {
    const reservedIds = getReservedVehicleIds();
    if (reservedIds.includes(vehicle.id)) {
      return 'reserved';
    }
    return vehicle.status || 'maintenanceCompleted';
  }, [getReservedVehicleIds]);

  // Filtrar vehículos basado en búsqueda y filtro
  const filteredVehicles = useCallback(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterType === 'all' ||
        vehicle.type?.toLowerCase() === filterType.toLowerCase();

      const effectiveStatus = getEffectiveVehicleStatus(vehicle);
      const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;

      return matchesSearch && matchesFilter && matchesStatus;
    });
  }, [vehicles, searchTerm, filterType, statusFilter, getEffectiveVehicleStatus]);

  // Obtener tipos únicos para el filtro
  const uniqueTypes = useCallback(() => {
    return [...new Set(vehicles.map(v => v.type).filter(Boolean))];
  }, [vehicles]);

  // Funciones para calcular estadísticas
  const getVehiclesByStatus = useCallback((status) => {
    if (status === 'all') return vehicles;

    return vehicles.filter(vehicle => {
      const effectiveStatus = getEffectiveVehicleStatus(vehicle);
      return effectiveStatus === status;
    });
  }, [vehicles, getEffectiveVehicleStatus]);

  const getStatusCounts = useCallback(() => {
    const reservedIds = getReservedVehicleIds();

    return {
      total: vehicles.length,
      reserved: reservedIds.length,
      underMaintenance: vehicles.filter(v => v.status === 'underMaintenance').length,
      maintenanceRequired: vehicles.filter(v => v.status === 'maintenanceRequired').length,
      outOfService: vehicles.filter(v => v.status === 'outOfService').length,
      maintenanceCompleted: vehicles.filter(v => {
        const effectiveStatus = getEffectiveVehicleStatus(v);
        return effectiveStatus === 'maintenanceCompleted';
      }).length
    };
  }, [vehicles, getReservedVehicleIds, getEffectiveVehicleStatus]);

  // Handlers del formulario
  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingVehicle(null);
    refetch();
  }, [refetch]);

  const handleAddVehicle = useCallback(() => {
    if (!hasAdminRole) {
      alert('Solo los administradores pueden agregar vehículos');
      return;
    }
    setEditingVehicle(null);
    setShowForm(true);
  }, [hasAdminRole]);

  const handleEditVehicle = useCallback((vehicle, isEditing = true) => {
    if (!hasAdminRole) {
      alert('Solo los administradores pueden editar vehículos');
      return;
    }
    console.log('🔧 Editando vehículo:', vehicle.name, 'isEditing:', isEditing);
    setEditingVehicle(vehicle);
    setShowForm(true);
  }, [hasAdminRole]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingVehicle(null);
  }, []);

  const handleCreateSubmit = useCallback(async (vehicleData) => {
    try {
      await createVehicle(vehicleData, () => {
        handleFormSuccess();
      });
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      // El error ya se maneja en el hook
    }
  }, [createVehicle, handleFormSuccess]);

  const handleUpdateSubmit = useCallback(async (vehicleId, updateData) => {
    try {
      await updateVehicle(vehicleId, updateData, () => {
        handleFormSuccess();
      });
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      // El error ya se maneja en el hook
    }
  }, [updateVehicle, handleFormSuccess]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleStatusFilterClick = useCallback((status) => {
    setStatusFilter(status);
    // Limpiar otros filtros para mostrar solo por estado
    setSearchTerm('');
    setFilterType('all');
  }, []);

  // Handlers para los filtros
  const handleSearchTermChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleFilterTypeChange = useCallback((type) => {
    setFilterType(type);
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  return {
    // Estados
    vehicles,
    loading,
    error,
    authLoading,
    hasAdminRole,
    isAuthenticated,
    operationLoading,
    showForm,
    editingVehicle,
    searchTerm,
    filterType,
    statusFilter,
    reservations,
    reservationsLoading,
    
    // Datos computados
    filteredVehicles: filteredVehicles(),
    uniqueTypes: uniqueTypes(),
    statusCounts: getStatusCounts(),
    isEditingMode: !!editingVehicle,
    
    // Funciones de utilidad
    getReservedVehicleIds,
    getEffectiveVehicleStatus,
    getVehiclesByStatus,
    
    // Handlers del formulario
    handleFormSuccess,
    handleAddVehicle,
    handleEditVehicle,
    handleCloseForm,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleRefresh,
    handleStatusFilterClick,
    
    // Handlers de filtros
    handleSearchTermChange,
    handleFilterTypeChange,
    handleStatusFilterChange,
    
    // Funciones de filtro
    setSearchTerm,
    setFilterType,
    setStatusFilter
  };
};