import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';
import { useDateContext } from '../../context/DateContext';
import DateForm from '../../components/forms/DateForm';
import ReservationService from '../../services/reservationService';
import { useAuth } from '../../hooks/useAuth';

// Componente para cada tarjeta de vehículo
const VehicleCard = ({ vehicle, isFiltered = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { startDate, endDate } = useDateContext();
    
    const handleReservation = () => {
        if (!user) {
            navigate('/login', {
                state: { redirectTo: `/customer/reservation-page/${vehicle.id}` }
            });
        } else {
            navigate(`/customer/reservation-page/${vehicle.id}`);
        }
    };

    // Calcular precio si hay fechas seleccionadas
    const calculation = startDate && endDate
        ? ReservationService.calculateTotalPrice(startDate, endDate, vehicle.price)
        : null;

    return (
        <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/15 ${isFiltered ? 'ring-2 ring-white/30' : ''}`}>
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>
            <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
            <p className="text-white/70">{vehicle.type}</p>
            <div className="flex justify-between items-center mt-2">
                <p className="text-white font-semibold">Renta por dia: ${vehicle.price}</p>
                {/* Mostrar cálculo si hay fechas */}
                {calculation && calculation.days > 0 && (
                    <div className="mt-2 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                        <p className="text-sm text-white/70">
                            {calculation.days} día{calculation.days > 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-bold text-white">
                            Total: ${calculation.totalPrice}
                        </p>
                    </div>
                )}
                <button
                    onClick={handleReservation}
                    className="cursor-pointer bg-gradient-to-r from-black to-neutral-900 text-white px-4 py-2 rounded-full hover:from-neutral-600 hover:to-neutral-800 transition-all duration-300 shadow-md">
                    Alquilar
                </button>
            </div>
        </div>
    );
};

const VehiclesPage = () => {
    const { vehicles, loading, error } = useVehicles();
    const { startDate, endDate } = useDateContext();
    const [filteredType, setFilteredType] = useState('all');
    const [busyVehicleIds, setBusyVehicleIds] = useState([]);

    // Definir si hay filtros de fecha activos
    const hasDateFilter = startDate && endDate;

    // Filtrar vehículos disponibles
    let filteredVehicles = vehicles.filter(vehicle => {
        // Solo mostrar vehículos con estado "maintenanceCompleted" o sin estado definido
        const vehicleStatus = vehicle.status || 'maintenanceCompleted' ;
        const isMaintenanceCompleted = vehicleStatus === 'maintenanceCompleted';
        
        // Filtrar por tipo si no es 'all'
        const typeMatch = filteredType === 'all' || vehicle.type === filteredType;
        
        // No mostrar vehículos ocupados si hay fechas seleccionadas
        const isNotBusy = !hasDateFilter || !busyVehicleIds.includes(vehicle.id);
        
        return isMaintenanceCompleted && typeMatch && isNotBusy;
    });

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Validar que la fecha de inicio sea antes o igual a la de fin
            if (start > end) {
                console.warn('❗Fechas inválidas: inicio después del fin');
                return;
            }

            const formatDate = (d) => {
                const date = new Date(d);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`; // formato esperado por el backend
            };

            ReservationService.getReservationsByDateRange(formatDate(startDate), formatDate(endDate))
                .then(reservations => {
                    const busyIds = reservations.map(r => r.vehicle.id);
                    setBusyVehicleIds(busyIds);
                })
                .catch(console.error);
        } else {
            // Si no hay fechas seleccionadas, limpiar la lista de vehículos ocupados
            setBusyVehicleIds([]);
        }
    }, [startDate, endDate]);

    // Manejo de estados de carga y error
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-25 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando vehículos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-25 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-600"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white px-6 py-25 ">
            <h1 className="text-2xl font-bold mb-6 text-white">Vehículos Disponibles</h1>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
                {['all', 'Sedan', 'SUV', 'PickUp'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilteredType(type)}
                        className={`px-6 py-2 rounded-3xl text-sm font-semibold transition-all duration-300 ${filteredType === type
                            ? 'bg-white text-neutral-900 shadow-md'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                            }`}
                    >
                        {type === 'all' ? 'Todos' : type}
                    </button>
                ))}

                {/* Formulario de fechas al final */}
                <div className="ml-auto">
                    <DateForm variant="vehicles" />
                </div>
            </div>

            {/* Mostrar información de filtros activos */}
            {hasDateFilter && (
                <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                        📅 Mostrando disponibilidad del {new Date(startDate).toLocaleDateString()} al {new Date(endDate).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Mensaje cuando no hay vehículos disponibles */}
            {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            No hay vehículos disponibles
                        </h3>
                        <p className="text-white/70 mb-4">
                            {hasDateFilter 
                                ? 'No hay vehículos disponibles para las fechas seleccionadas.' 
                                : 'Actualmente no hay vehículos disponibles para alquilar.'
                            }
                        </p>
                        {hasDateFilter && (
                            <p className="text-white/60 text-sm">
                                Intenta seleccionar otras fechas o contacta con nosotros para más opciones.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Grid de vehículos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isFiltered={hasDateFilter}
                    />
                ))}
            </div>
        </div>
    );
};

export default VehiclesPage;