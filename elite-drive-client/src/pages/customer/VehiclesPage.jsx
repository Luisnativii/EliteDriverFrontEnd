import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';


// Componente para cada tarjeta de vehículo
const VehicleCard = ({ vehicle }) => {
    const navigate = useNavigate();
    const handleReservation = () => {
        navigate(`/customer/reservation-page/${vehicle.id}`);
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
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
            <h3 className="text-lg font-bold text-gray-800">{vehicle.name}</h3>
            <p className="text-gray-600">{vehicle.type}</p>
            <div className="flex justify-between items-center mt-2">
            <p className="text-gray-800 font-semibold">Renta por dia: ${vehicle.price}</p>
            <button 
                onClick={handleReservation}
            className="w-auto cursor-pointer bg-neutral-800 text-white px-4 py-2 rounded-full hover:bg-neutral-500 hover:text-gray-100 transition-colors duration-200">
                Alquilar
            </button>
            </div>
        </div>
    );
};

const VehiclesPage = () => {
    
    const {vehicles, loading, error} = useVehicles();
    const [filteredType, setFilteredType] = useState('all');

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

    const filteredVehicles = filteredType === 'all'
        ? vehicles
        : vehicles.filter(v => v.type === filteredType);

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-25 ">
            <h1 className="text-3xl font-bold mb-6 text-neutral-800">Vehículos Disponibles</h1>

            {/* Filtros */}
            <div className="flex gap-4 mb-8">
                <button 
                    className={`px-4 py-2 cursor-pointer hover:scale-105 transition-all rounded-full ${filteredType === 'all' ? 'bg-neutral-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilteredType('all')}
                >
                    Todos
                </button>
                <button 
                    className={`px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-200 rounded-full ${filteredType === 'Sedán' ? 'bg-neutral-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilteredType('Sedán')}
                >
                    Sedán
                </button>
                <button 
                    className={`px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-200 rounded-full ${filteredType === 'SUV' ? 'bg-neutral-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilteredType('SUV')}
                >
                    SUV
                </button>
                <button 
                    className={`px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-200 rounded-full ${filteredType === 'PickUP' ? 'bg-neutral-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilteredType('PickUP')}
                >
                    PickUP
                </button>
            </div>

            {/* Grid de vehículos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
            </div>
        </div>
    );

}

export default VehiclesPage;