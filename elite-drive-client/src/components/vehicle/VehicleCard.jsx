import React, { useState } from 'react';
import { useVehicleOperations } from '../../hooks/useVehicles';
import { 
  Edit2, 
  Trash2, 
  Users, 
  MapPin, 
  DollarSign, 
  Car,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';

const VehicleCard = ({ vehicle, onEdit, onRefresh, isAdmin = false }) => {
  const { deleteVehicle } = useVehicleOperations();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(vehicle);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      
      await deleteVehicle(vehicle.id, () => {
        console.log(`✅ Vehículo ${vehicle.name} eliminado exitosamente`);
        setShowDeleteConfirm(false);
        
        // Refrescar la lista de vehículos
        if (onRefresh) {
          onRefresh();
        }
      });
      
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
      alert(error.message || 'Error al eliminar el vehículo');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Formatear kilómetros
  const formatKilometers = (km) => {
    return new Intl.NumberFormat('es-US').format(km);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Imagen del vehículo */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          {vehicle.image ? (
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = '/images/vehicle-placeholder.jpg';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-6">
          {/* Header con nombre y tipo */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {vehicle.name}
              </h3>
              <p className="text-sm text-gray-500">
                {vehicle.brand} {vehicle.model}
              </p>
            </div>
            {vehicle.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {vehicle.type}
              </span>
            )}
          </div>

          {/* Información del vehículo */}
          <div className="space-y-2 mb-4">
            {/* Capacidad */}
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span>Capacidad: {vehicle.capacity} personas</span>
            </div>

            {/* Kilómetros */}
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formatKilometers(vehicle.kilometers)} km</span>
            </div>

            {/* Precio */}
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium text-gray-900">
                {formatPrice(vehicle.price)} / día
              </span>
            </div>

            {/* Características */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                  {vehicle.features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-500">
                      +{vehicle.features.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción (solo para admin) */}
          {isAdmin && (
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={handleEdit}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Eliminación
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el vehículo <strong>{vehicle.name}</strong>? 
              Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleCard;