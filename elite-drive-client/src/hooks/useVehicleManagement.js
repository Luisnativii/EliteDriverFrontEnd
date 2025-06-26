import { useState, useCallback, useEffect, useMemo } from 'react';
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
    
    // Estados para reservaciones (usando el mismo patrón que ReservationManagementPage)
    const [reservations, setReservations] = useState([]);
    const [reservationsLoading, setReservationsLoading] = useState(false);
    const [reservationsError, setReservationsError] = useState(null);

    const [reservationDateFrom, setReservationDateFrom] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });

    const [reservationDateTo, setReservationDateTo] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    });

    // Función para obtener todas las reservas (igual que en ReservationManagementPage)
    const fetchAllReservations = useCallback(async () => {
        try {
            setReservationsLoading(true);
            setReservationsError(null);
            console.log('🔍 Obteniendo todas las reservas...');

            // Usar getAllReservations igual que en ReservationManagementPage
            const reservationsData = await ReservationService.getAllReservations();
            
            // Transformar datos igual que en ReservationManagementPage
            const transformedReservations = reservationsData.map(reservation => ({
                id: reservation.id,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                totalPrice: reservation.totalPrice,
                status: reservation.status || 'active',
                createdAt: reservation.createdAt || new Date().toISOString(),
                user: {
                    id: reservation.user?.id || reservation.userId,
                    name: reservation.user?.name || 'Usuario no disponible',
                    email: reservation.user?.email || 'email@no-disponible.com',
                    dui: reservation.user?.dui || 'N/A'
                },
                vehicle: {
                    id: reservation.vehicle?.id || reservation.vehicleId,
                    name: reservation.vehicle?.name || 'Vehículo no disponible',
                    brand: reservation.vehicle?.brand || 'N/A',
                    model: reservation.vehicle?.model || 'N/A',
                    type: reservation.vehicle?.vehicleType?.type || reservation.vehicle?.type || 'N/A',
                    capacity: reservation.vehicle?.capacity || 0
                }
            }));

            console.log('📋 Reservas transformadas:', transformedReservations.length);
            setReservations(transformedReservations);

        } catch (err) {
            console.error('❌ Error al cargar reservas:', err);
            setReservationsError(err.message || 'Error al cargar las reservas');
            setReservations([]);
        } finally {
            setReservationsLoading(false);
        }
    }, []);

    // Cargar reservas cuando sea necesario
    useEffect(() => {
        if (isAuthenticated && hasAdminRole && !authLoading) {
            fetchAllReservations();
        } else if (!authLoading) {
            setReservationsLoading(false);
        }
    }, [isAuthenticated, hasAdminRole, authLoading, fetchAllReservations]);

    // Filtrar reservas por el rango de fechas especificado
    const reservationsInDateRange = useMemo(() => {
        if (!reservationDateFrom || !reservationDateTo || reservations.length === 0) {
            return [];
        }

        const fromDate = new Date(reservationDateFrom);
        const toDate = new Date(reservationDateTo);
        
        // Establecer horas para comparación correcta
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        const filteredReservations = reservations.filter(reservation => {
            // Solo considerar reservas activas/confirmadas
            if (reservation.status?.toLowerCase() !== 'active' && 
                reservation.status?.toLowerCase() !== 'confirmado') {
                return false;
            }

            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);

            // La reserva está activa en el rango si:
            // - Su fecha de inicio es <= toDate Y su fecha de fin es >= fromDate
            return startDate <= toDate && endDate >= fromDate;
        });

        console.log('🗓️ Reservas en rango de fechas:', {
            fromDate: reservationDateFrom,
            toDate: reservationDateTo,
            totalReservations: reservations.length,
            filteredCount: filteredReservations.length,
            filtered: filteredReservations.map(r => ({
                id: r.id,
                vehicleName: r.vehicle.name,
                vehicleId: r.vehicle.id,
                startDate: r.startDate,
                endDate: r.endDate,
                status: r.status
            }))
        });

        return filteredReservations;
    }, [reservations, reservationDateFrom, reservationDateTo]);

    // Obtener IDs de vehículos reservados en el rango de fechas
    const reservedVehicleIds = useMemo(() => {
        const ids = reservationsInDateRange
            .map(reservation => reservation.vehicle.id)
            .filter(Boolean);
        
        // Eliminar duplicados
        const uniqueIds = [...new Set(ids)];
        
        console.log('🚗 IDs de vehículos reservados:', uniqueIds);
        return uniqueIds;
    }, [reservationsInDateRange]);

    // Función para obtener vehículos reservados (para compatibilidad)
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
    const filteredVehicles = useMemo(() => {
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
    const uniqueTypes = useMemo(() => {
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

    const statusCounts = useMemo(() => {
        const counts = {
            total: vehicles.length,
            reserved: reservedVehicleIds.length,
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
    }, [vehicles, reservedVehicleIds, getEffectiveVehicleStatus]);

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
        // También refrescar las reservaciones
        fetchAllReservations();
    }, [refetch, fetchAllReservations]);

    const handleStatusFilterClick = useCallback((status) => {
        console.log('🔄 Cambiando filtro de estado a:', status);
        setStatusFilter(status);
        // Limpiar otros filtros para mostrar solo por estado
        setSearchTerm('');
        setFilterType('all');
    }, []);

    // Handlers para los filtros de fecha
    const handleReservationDateFromChange = useCallback((date) => {
        console.log('📅 Cambiando fecha desde:', date);
        setReservationDateFrom(date);
    }, []);

    const handleReservationDateToChange = useCallback((date) => {
        console.log('📅 Cambiando fecha hasta:', date);
        setReservationDateTo(date);
    }, []);

    return {
        // Estados principales
        vehicles,
        loading: loading || reservationsLoading,
        error: error || reservationsError,
        authLoading,
        hasAdminRole,
        isAuthenticated,
        operationLoading,
        showForm,
        editingVehicle,
        searchTerm,
        filterType,
        statusFilter,
        
        // Estados de reservaciones
        reservations,
        reservationsLoading,
        reservationsError,
        reservationDateFrom,
        reservationDateTo,
        reservationsInDateRange, // Nuevo: reservas en el rango de fechas
        
        // Datos computados
        filteredVehicles,
        uniqueTypes,
        statusCounts,
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

        // Handlers de filtros de fecha
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