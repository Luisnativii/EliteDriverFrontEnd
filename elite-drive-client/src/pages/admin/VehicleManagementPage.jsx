import React, { useState, useCallback, useEffect } from 'react';
import { useVehicles, useAuthCheck, useVehicleOperations } from '../../hooks/useVehicles';
import CreateVehicleForm from '../../components/forms/CreateVehicleForm';
import EditVehicleForm from '../../components/forms/EditVehicleForm';
import VehicleCard from '../../components/vehicle/VehicleCard';
import VehicleFilterForm from '../../components/forms/VehicleFilterForm';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import ReservationService from '@/services/reservationService';
import { Plus, Search, AlertCircle, Wrench, Car, Calendar } from 'lucide-react';

const VehicleManagementPage = () => {
  const { vehicles, loading, error, refetch } = useVehicles();
  const { hasAdminRole, isAuthenticated, loading: authLoading } = useAuthCheck();
  const { createVehicle, updateVehicle, isLoading: operationLoading } = useVehicleOperations();
  
  // Estados del componente
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // ⚠️ Esta variable faltaba
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
  const getReservedVehicleIds = () => {
    return reservations.map(reservation => reservation.vehicle?.id).filter(Boolean);
  };

  // Función para determinar el estado efectivo de un vehículo
  const getEffectiveVehicleStatus = (vehicle) => {
    const reservedIds = getReservedVehicleIds();
    if (reservedIds.includes(vehicle.id)) {
      return 'reserved';
    }
    return vehicle.status || 'maintenanceCompleted';
  };

  // Filtrar vehículos basado en búsqueda y filtro
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' ||
      vehicle.type?.toLowerCase() === filterType.toLowerCase();

    const effectiveStatus = getEffectiveVehicleStatus(vehicle);
    const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;

    return matchesSearch && matchesFilter && matchesStatus;
  });

  // Obtener tipos únicos para el filtro
  const uniqueTypes = [...new Set(vehicles.map(v => v.type).filter(Boolean))];

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVehicle(null);
    refetch();
  };

  const handleAddVehicle = () => {
    if (!hasAdminRole) {
      alert('Solo los administradores pueden agregar vehículos');
      return;
    }
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle, isEditing = true) => {
    if (!hasAdminRole) {
      alert('Solo los administradores pueden editar vehículos');
      return;
    }
    console.log('🔧 Editando vehículo:', vehicle.name, 'isEditing:', isEditing);
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleCreateSubmit = async (vehicleData) => {
    try {
      await createVehicle(vehicleData, () => {
        handleFormSuccess();
      });
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      // El error ya se maneja en el hook
    }
  };

  const handleUpdateSubmit = async (vehicleId, updateData) => {
    try {
      await updateVehicle(vehicleId, updateData, () => {
        handleFormSuccess();
      });
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      // El error ya se maneja en el hook
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleStatusFilterClick = (status) => {
    setStatusFilter(status);
    // Limpiar otros filtros para mostrar solo por estado
    setSearchTerm('');
    setFilterType('all');
  };

  // Funciones para calcular estadísticas
  const getVehiclesByStatus = (status) => {
    if (status === 'all') return vehicles;

    return vehicles.filter(vehicle => {
      const effectiveStatus = getEffectiveVehicleStatus(vehicle);
      return effectiveStatus === status;
    });
  };

  const getStatusCounts = () => {
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
  };

  // Mostrar loading mientras se cargan auth y vehículos
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const isEditingMode = !!editingVehicle;

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Acceso Restringido
          </h2>
          <p className="text-white/80 mb-6">
            Debes iniciar sesión para acceder a la gestión de vehículos
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header y filtros usando VehicleFilterForm */}
        <div className="mt-15">
          <VehicleFilterForm
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            uniqueTypes={uniqueTypes}
            hasAdminRole={hasAdminRole}
            onAddVehicle={handleAddVehicle}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Error Message con glassmorphism */}
        {error && (
          <div className="mb-8 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
                <span className="text-red-200 font-medium">{error}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="text-red-300 hover:text-red-100 text-sm font-semibold px-4 py-2 bg-red-500/20 rounded-lg transition-all duration-300 hover:bg-red-500/30"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Stats con glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {/* Total vehículos */}
          <div
            onClick={() => handleStatusFilterClick('all')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${statusFilter === 'all' ? 'ring-2 ring-blue-400' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-white/70">Total</p>
                <p className="text-lg font-bold text-white">{statusCounts.total}</p>
              </div>
            </div>
          </div>

          {/* Mantenimiento completado */}
          <div
            onClick={() => handleStatusFilterClick('maintenanceCompleted')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${statusFilter === 'maintenanceCompleted' ? 'ring-2 ring-emerald-400' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Car className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-white/70">Disponible</p>
                <p className="text-lg font-bold text-white">{statusCounts.maintenanceCompleted}</p>
              </div>
            </div>
          </div>

          {/* Reservados hoy */}
          <div
            onClick={() => handleStatusFilterClick('reserved')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${statusFilter === 'reserved' ? 'ring-2 ring-green-400' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-white/70">Reservados</p>
                <p className="text-lg font-bold text-white">{statusCounts.reserved}</p>
              </div>
            </div>
          </div>

          {/* Fuera de servicio */}
          <div
            onClick={() => handleStatusFilterClick('outOfService')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${statusFilter === 'outOfService' ? 'ring-2 ring-red-400' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-500/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-white/70">Fuera de servicio</p>
                <p className="text-lg font-bold text-white">{statusCounts.outOfService}</p>
              </div>
            </div>
          </div>

          {/* Requiere mantenimiento */}
          <div
            onClick={() => handleStatusFilterClick('maintenanceRequired')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${statusFilter === 'maintenanceRequired' ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-white/70">Revisión</p>
                <p className="text-lg font-bold text-white">{statusCounts.maintenanceRequired}</p>
              </div>
            </div>
          </div>

          {/* En mantenimiento */}
          <div
            onClick={() => handleStatusFilterClick('underMaintenance')}
            className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${statusFilter === 'underMaintenance' ? 'ring-2 ring-orange-400' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-500/20 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-5 h-5 text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-white/70">Mantenimiento</p>
                <p className="text-lg font-bold text-white">{statusCounts.underMaintenance}</p>
              </div>
            </div>
          </div>
          
        </div>

        {statusFilter !== 'all' && (
          <div className="mb-6 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center">
              <span className="text-white/70 text-sm mr-2">Filtrando por:</span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-medium">
                {statusFilter === 'reserved' && 'Reservados Hoy'}
                {statusFilter === 'underMaintenance' && 'En Mantenimiento'}
                {statusFilter === 'maintenanceRequired' && 'Requiere Mantenimiento'}
                {statusFilter === 'outOfService' && 'Fuera de Servicio'}
                {statusFilter === 'maintenanceCompleted' && 'Disponibles'}
              </span>
            </div>
            <button
              onClick={() => handleStatusFilterClick('all')}
              className="text-white/60 hover:text-white transition-colors duration-300 text-sm bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
            >
              Limpiar filtro
            </button>
          </div>
        )}

        {filteredVehicles.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {searchTerm || filterType !== 'all' || statusFilter !== 'all' ?
                'No se encontraron vehículos' :
                'No hay vehículos registrados'
              }
            </h3>
            <p className="text-white/70 text-sm mb-8">
              {statusFilter !== 'all' ?
                `No hay vehículos con estado "${statusFilter}"` :
                searchTerm || filterType !== 'all' ?
                  'Intenta ajustar tus filtros de búsqueda' :
                  'Comienza agregando tu primer vehículo a la flota premium'
              }
            </p>
            {(!searchTerm && filterType === 'all' && statusFilter === 'all' && hasAdminRole) && (
              <button
                onClick={handleAddVehicle}
                className="inline-flex text-sm items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Plus className="w-5 h-5 mr-3" />
                Agregar Primer Vehículo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEditVehicle}
                onRefresh={refetch}
                isAdmin={hasAdminRole}
              />
            ))}
          </div>
        )}

        {/* Modal del formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {isEditingMode ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-white/60 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg"
                  >
                    <span className="sr-only">Cerrar</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {isEditingMode ? (
                  <EditVehicleForm
                    vehicle={editingVehicle}
                    onSubmit={handleUpdateSubmit}
                    onCancel={handleCloseForm}
                    submitLoading={operationLoading}
                  />
                ) : (
                  <CreateVehicleForm
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCloseForm}
                    submitLoading={operationLoading}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagementPage;