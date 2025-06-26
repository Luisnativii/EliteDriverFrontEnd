import React from 'react';
import { 
  Car
} from 'lucide-react';

const VehicleDragCard = ({ vehicle, onDragStart, onDragEnd, isDragging }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, vehicle)}
            onDragEnd={onDragEnd}
            className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 cursor-move hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${isDragging ? 'opacity-50 rotate-3' : ''
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg truncate">{vehicle.name}</h3>
                    <p className="text-white/70 text-sm">{vehicle.brand} {vehicle.model}</p>
                </div>
                <div className="ml-2 p-2 bg-white/10 rounded-lg">
                    <Car className="w-4 h-4 text-white/60" />
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-white/70">Tipo:</span>
                    <span className="text-white">{vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/70">Kilómetros:</span>
                    <span className="text-white">{vehicle.kilometers?.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/70">Capacidad:</span>
                    <span className="text-white">{vehicle.capacity} personas</span>
                </div>
            </div>

            {vehicle.image && (
                <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-24 object-cover"
                    />
                </div>
            )}
        </div>
    );
}

export default VehicleDragCard;