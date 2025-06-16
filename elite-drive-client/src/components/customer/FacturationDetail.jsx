import React, { useState, useEffect } from 'react';

const FacturationDetail = ({ vehicle, onReservation }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalDays, setTotalDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    
    // Calcular días y precio total cuando cambien las fechas
    useEffect(() => {
        if (startDate && endDate && vehicle) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                setTotalDays(diffDays);
                setTotalPrice(diffDays * vehicle.price);
            } else {
                setTotalDays(0);
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate, vehicle]);

    const handleReservation = () => {
        if (!startDate || !endDate) {
            alert('Por favor selecciona las fechas de inicio y fin');
            return;
        }
        
        if (new Date(startDate) >= new Date(endDate)) {
            alert('La fecha de fin debe ser posterior a la fecha de inicio');
            return;
        }

        // Datos de la reserva
        const reservationData = {
            vehicleId: vehicle.id,
            startDate,
            endDate,
            totalDays,
            totalPrice
        };

        // Si se pasa una función onReservation, la ejecuta
        if (onReservation) {
            onReservation(reservationData);
        } else {
            // Lógica por defecto
            console.log('Reserva procesada:', reservationData);
            alert('¡Reserva realizada con éxito!');
        }
    };

    if (!vehicle) return null;

    return(

        <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Detalles de la Reserva</h3>
                        
                        <div className="space-y-6">
                            {/* Fecha de inicio */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Fecha de fin */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Fin
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Resumen de la reserva */}
                            {totalDays > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Resumen de la Reserva</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Días de alquiler:</span>
                                            <span className="font-medium">{totalDays} día{totalDays > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Precio por día:</span>
                                            <span className="font-medium">${vehicle.price}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-semibold text-gray-900">Total:</span>
                                                <span className="text-2xl font-bold text-stone-900">${totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botón de alquilar */}
                            <button
                                onClick={handleReservation}
                                disabled={!startDate || !endDate || totalDays <= 0}
                                className="w-full cursor-pointer  bg-red-600 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Alquilar Vehículo
                            </button>

                            {/* Información adicional */}
                            <div className="text-sm text-gray-600 mt-4">
                                <p>• Las reservas se confirman inmediatamente</p>
                                <p>• Puedes cancelar hasta 24 horas antes</p>
                                <p>• Se requiere licencia de conducir válida</p>
                            </div>
                        </div>
                    </div>
    );
};

export default FacturationDetail;