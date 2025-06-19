import React, { useState } from 'react';
import { useVehicles, useAuthCheck } from '../../hooks/useVehicles';
import VehicleForm from '../../components/forms/VehicleForm';
import VehicleCard from '../../components/vehicle/VehicleCard';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import { Plus, Search, Filter, AlertCircle, RefreshCw, Wrench, Car, Calendar } from 'lucide-react';

const VehicleManagementPage = () => {
  const { vehicles, loading, error, refetch } = useVehicles();
  const { hasAdminRole, isAuthenticated, loading: authLoading } = useAuthCheck();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Filtrar vehículos basado en búsqueda y filtro
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         vehicle.type?.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Obtener tipos únicos para el filtro
  const uniqueTypes = [...new Set(vehicles.map(v => v.type).filter(Boolean))];

  const handleAddVehicle = () => {
    if (!hasAdminRole) {
      alert('Solo los administradores pueden agregar vehículos');
      return;
    }
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle) => {
    if (!hasAdminRole) {
      alert('Solo los administradores pueden editar vehículos');
      return;
    }
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVehicle(null);
    refetch();
  };

  const handleRefresh = () => {
    refetch();
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

  return (
    <div className="min-h-screen bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con glassmorphism */}
        <div className="mt-15  bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 mb-8 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Gestión de Vehículos
                  </h1>
                  <p className="text-white/70 text-sm">
                    {hasAdminRole ? 
                      'Panel administrativo para gestionar la flota de vehículos premium' :
                      'Catálogo de vehículos disponibles para renta'
                    }
                  </p>
                </div>
              </div>
              <div className="mt-6 sm:mt-0 flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="group inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Actualizar
                </button>
                {hasAdminRole && (
                  <button
                    onClick={handleAddVehicle}
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Vehículo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda con glassmorphism */}
          <div className="px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barra de búsqueda */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3/7 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, marca o modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                />
              </div>

              {/* Filtro por tipo */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent appearance-none min-w-[180px] transition-all duration-300 hover:bg-white/15"
                >
                  <option value="all" className="bg-gray-900 text-white">Todos los tipos</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-900 text-white">{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-white/10 backdrop-blur-md  rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Total vehículos</p>
                <p className="text-xl font-bold text-white">{vehicles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">En renta</p>
                <p className="text-xl font-bold text-white">{uniqueTypes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">En mantenimiento</p>
                <p className="text-xl font-bold text-white">
                  ${vehicles.length > 0 ? 
                    (vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length).toFixed(0) : 
                    '0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de vehículos */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchTerm || filterType !== 'all' ? 
                'No se encontraron vehículos' : 
                'No hay vehículos registrados'
              }
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              {searchTerm || filterType !== 'all' ? 
                'Intenta ajustar tus filtros de búsqueda' : 
                'Comienza agregando tu primer vehículo a la flota premium'
              }
            </p>
            {(!searchTerm && filterType === 'all' && hasAdminRole) && (
              <button
                onClick={handleAddVehicle}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
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

        {/* Modal del formulario con glassmorphism */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
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
                <VehicleForm
                  vehicle={editingVehicle}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagementPage;