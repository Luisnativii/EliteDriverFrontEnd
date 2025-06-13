import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVehicle } from '../../hooks/useVehicles';

const ReservationPage = () => {
    const { vehicleId } = useParams();
    const {vehicle: selectedVehicle, loading, error} = useVehicle(vehicleId);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-25 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">Hoy c come...</p>
                </div>
            </div>
        );
    }
    if (error || !selectedVehicle) return <div>Vehículo no encontrado</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-5">
            <h1 className="text-3xl font-bold mb-6">Reservar Vehículo, lo deje feito hay que ponerlo divo</h1>
            
            {/* Mostrar información del vehículo seleccionado */}
            <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex gap-6">
                    <img 
                        src={selectedVehicle.image} 
                        alt={selectedVehicle.name}
                        className="w-48 h-32 object-cover rounded-lg"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{selectedVehicle.name}</h2>
                        <p className="text-gray-600">{selectedVehicle.type}</p>
                        <p className="text-xl font-semibold mt-2">
                            Renta por día: ${selectedVehicle.price}
                        </p>
                    </div>
                </div>
            </div>

            {/* Aquí va tu formulario de reserva */}
            <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Detalles de la Reserva</h3>
                 {/*  formulario de reserva NATIVI DIO MIO DONDE ESTASDOIASDOASFJASIO */}
            </div>
        </div>
    );
};

export default ReservationPage;