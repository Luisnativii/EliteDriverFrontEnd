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
    const [reservedVehicleIds, setReservedVehicleIds] = useState([]);
    const [reservationsLoading, setReservationsLoading] = useState(false);
    const [reservationsData, setReservationsData] = useState([]); // Nuevo estado para guardar todas las reservaciones

    const [reservationDateFrom, setReservationDateFrom] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });

    const [reservationDateTo, setReservationDateTo] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });

    // Función para obtener vehículos reservados en el rango de fechas
    const fetchReservedVehicleIds = useCallback(async () => {
        try {
            setReservationsLoading(true);
            console.log('🔍 Obteniendo vehículos reservados del', reservationDateFrom, 'al', reservationDateTo);
            
            // Obtener las reservaciones completas para debugging
            const reservations = await ReservationService.getReservationsByDateRange(
                reservationDateFrom,
                reservationDateTo
            );
            
            console.log('📋 Reservaciones obtenidas:', reservations);
            setReservationsData(reservations); // Guardar todas las reservaciones
            
            // Extraer los IDs de vehículos
            const reservedIds = reservations
                .map(reservation => {
                    // Verificar diferentes estructuras posibles del objeto reservation
                    if (reservation.vehicle?.id) {
                        return reservation.vehicle.id;
                    } else if (reservation.vehicleId) {
                        return reservation.vehicleId;
                    } else if (reservation.vehicle_id) {
                        return reservation.vehicle_id;
                    }
                    return null;
                })
                .filter(Boolean); // Filtrar valores null/undefined
            
            console.log('🚗 IDs de vehículos reservados:', reservedIds);
            console.log('🎯 Total vehículos reservados:', reservedIds.length);
            
            setReservedVehicleIds(reservedIds);
        } catch (error) {
            console.error('❌ Error al cargar vehículos reservados:', error);
            setReservedVehicleIds([]);
            setReservationsData([]);
        } finally {
            setReservationsLoading(false);
        }
    }, [reservationDateFrom, reservationDateTo]);

    // Cargar vehículos reservados cuando sea necesario
    useEffect(() => {
        if (vehicles.length > 0 && statusFilter === 'reserved') {
            console.log('🔄 Cargando vehículos reservados porque statusFilter = reserved');
            fetchReservedVehicleIds();
        } else if (statusFilter !== 'reserved') {
            // Limpiar IDs reservados si no estamos filtrando por reservados
            console.log('🧹 Limpiando vehículos reservados porque statusFilter ≠ reserved');
            setReservedVehicleIds([]);
            setReservationsData([]);
        }
    }, [vehicles, statusFilter, fetchReservedVehicleIds]);

    // Función para obtener vehículos reservados (simplificada)
    const getReservedVehicleIds = useCallback(() => {
        return reservedVehicleIds;
    }, [reservedVehicleIds]);

    // Función para determinar el estado efectivo de un vehículo
    const getEffectiveVehicleStatus = useCallback((vehicle) => {
        if (reservedVehicleIds.includes(vehicle.id)) {
            console.log(`✅ Vehículo ${vehicle.name} (ID: ${vehicle.id}) está reservado`);
            return 'reserved';
        }
        return vehicle.status || 'maintenanceCompleted';
    }, [reservedVehicleIds]);

    // Filtrar vehículos basado en búsqueda y filtro
    const filteredVehicles = useCallback(() => {
        console.log('🔍 Filtrando vehículos...');
        console.log('📊 Total vehículos:', vehicles.length);
        console.log('🔍 Término de búsqueda:', searchTerm);
        console.log('🏷️ Filtro de tipo:', filterType);
        console.log('📈 Filtro de estado:', statusFilter);
        console.log('🚗 IDs reservados activos:', reservedVehicleIds);

        const filtered = vehicles.filter(vehicle => {
            // Filtro de búsqueda
            const matchesSearch = searchTerm === '' || 
                vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro de tipo
            const matchesFilter = filterType === 'all' ||
                vehicle.type?.toLowerCase() === filterType.toLowerCase();

            // Filtro de estado
            let matchesStatus = true;
            if (statusFilter !== 'all') {
                const effectiveStatus = getEffectiveVehicleStatus(vehicle);
                matchesStatus = effectiveStatus === statusFilter;
                
                if (statusFilter === 'reserved') {
                    console.log(`🎯 Vehículo ${vehicle.name}: effectiveStatus=${effectiveStatus}, matchesStatus=${matchesStatus}`);
                }
            }

            const passes = matchesSearch && matchesFilter && matchesStatus;
            
            if (statusFilter === 'reserved' && passes) {
                console.log(`✅ Vehículo ${vehicle.name} pasa todos los filtros para 'reserved'`);
            }

            return passes;
        });

        console.log('📋 Vehículos filtrados:', filtered.length);
        
        if (statusFilter === 'reserved') {
            console.log('🚗 Vehículos reservados mostrados:', filtered.map(v => ({
                name: v.name,
                id: v.id,
                effectiveStatus: getEffectiveVehicleStatus(v)
            })));
        }

        return filtered;
    }, [vehicles, searchTerm, filterType, statusFilter, getEffectiveVehicleStatus, reservedVehicleIds]);

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

        const counts = {
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

        console.log('📊 Status counts:', counts);
        return counts;
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
        console.log('🔄 Refrescando datos...');
        refetch();
        // Si estamos filtrando por reservados, también refrescar las reservaciones
        if (statusFilter === 'reserved') {
            fetchReservedVehicleIds();
        }
    }, [refetch, statusFilter, fetchReservedVehicleIds]);

    const handleStatusFilterClick = useCallback((status) => {
        console.log('🔄 Cambiando filtro de estado a:', status);
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

    const handleReservationDateFromChange = useCallback((date) => {
        console.log('📅 Cambiando fecha desde:', date);
        setReservationDateFrom(date);
    }, []);

    const handleReservationDateToChange = useCallback((date) => {
        console.log('📅 Cambiando fecha hasta:', date);
        setReservationDateTo(date);
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
        reservationsLoading,
        reservationDateFrom,
        reservationDateTo,
        reservationsData, // Nuevo campo para debugging

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
        handleReservationDateFromChange,
        handleReservationDateToChange,
        setReservationDateFrom,
        setReservationDateTo,

        // Funciones de filtro
        setSearchTerm,
        setFilterType,
        setStatusFilter
    };
};