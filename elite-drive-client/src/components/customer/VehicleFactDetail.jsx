import React from 'react';

const VehicleFactDetail = ({ vehicle }) => {
    if (!vehicle) {
        return <div>No vehicle data available</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Imagen del vehículo */}
            <div className="h-64 bg-gray-200 flex items-center justify-center">
                {vehicle.image ? (
                    <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Información del vehículo */}
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{vehicle.name}</h2>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Marca:</span>
                        <span className="text-gray-900">{vehicle.brand || 'No especificada'}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Tipo:</span>
                        <span className="text-gray-900">{vehicle.type}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Modelo:</span>
                        <span className="text-gray-900">{vehicle.model || 'No especificado'}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Capacidad:</span>
                        <span className="text-gray-900">{vehicle.capacity || 'No especificada'} personas</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Categoría:</span>
                        <span className="text-gray-900">{vehicle.category || vehicle.type}</span>
                    </div>

                    <div className="border-t pt-3 mt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Precio por día:</span>
                            <span className="text-2xl font-bold text-stone-900">${vehicle.price}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Características adicionales */}
            <div className="p-6">
                {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                        <div className="flex flex-wrap gap-2">
                            {vehicle.features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );


};

export default VehicleFactDetail;  