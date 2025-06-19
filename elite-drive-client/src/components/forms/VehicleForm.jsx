import React, { useEffect } from 'react';
import { useVehicleForm, useVehicleOperations } from '../../hooks/useVehicles';
import { Car, Users, DollarSign, MapPin, Save, X, AlertCircle } from 'lucide-react';

const VehicleForm = ({ vehicle = null, onSuccess, onCancel }) => {
  const isEditing = !!vehicle;
  const { createVehicle, updateVehicle, isLoading, errors, clearErrors } = useVehicleOperations();
  
  const {
    formData,
    errors: formErrors,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setErrors
  } = useVehicleForm(vehicle ? {
    name: vehicle.name || '',
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    capacity: vehicle.capacity?.toString() || '',
    carType: vehicle.type || '',
    pricePerDay: vehicle.price?.toString() || '',
    kilometers: vehicle.kilometers?.toString() || '',
    features: vehicle.features || [],
    image: vehicle.image || null
  } : {});

  // Opciones para el select de tipo de vehículo
  const vehicleTypes = [
    { value: '', label: 'Selecciona un tipo' },
    { value: 'sedán', label: 'Sedán' },
    { value: 'suv', label: 'SUV' },
    { value: 'pickup', label: 'Pickup' },
  ];

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  // Manejar características
  const handleFeaturesChange = (e) => {
    const value = e.target.value;
    const featuresArray = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({
      ...prev,
      features: featuresArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateVehicle(vehicle.id, formData, onSuccess);
      } else {
        await createVehicle(formData, onSuccess);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const allErrors = { ...formErrors, ...errors };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Errores generales */}
      {(errors.create || errors.update) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-700">
              {errors.create || errors.update}
            </span>
          </div>
        </div>
      )}

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <Car className="w-4 h-4 inline mr-1" />
            Nombre del Vehículo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              allErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Toyota Corolla 2023"
          />
          {allErrors.name && (
            <p className="mt-1 text-sm text-red-600">{allErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Vehículo *
          </label>
          <select
            id="carType"
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              allErrors.carType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {allErrors.carType && (
            <p className="mt-1 text-sm text-red-600">{allErrors.carType}</p>
          )}
        </div>
      </div>

      {/* Marca y Modelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Marca *
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              allErrors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Toyota"
          />
          {allErrors.brand && (
            <p className="mt-1 text-sm text-red-600">{allErrors.brand}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            Modelo *
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              allErrors.model ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Corolla"
          />
          {allErrors.model && (
            <p className="mt-1 text-sm text-red-600">{allErrors.model}</p>
          )}
        </div>
      </div>

      {/* Capacidad y Kilómetros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Capacidad (personas) *
          </label>
          <input
            type="text"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              allErrors.capacity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: 5"
          />
          {allErrors.capacity && (
            <p className="mt-1 text-sm text-red-600">{allErrors.capacity}</p>
          )}
        </div>

        <div>
          <label htmlFor="kilometers" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Kilómetros *
          </label>
          <input
            type="text"
            id="kilometers"
            name="kilometers"
            value={formData.kilometers}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              allErrors.kilometers ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: 50000"
          />
          {allErrors.kilometers && (
            <p className="mt-1 text-sm text-red-600">{allErrors.kilometers}</p>
          )}
        </div>
      </div>

      {/* Precio */}
      <div>
        <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          Precio por Día (USD) *
        </label>
        <input
          type="text"
          id="pricePerDay"
          name="pricePerDay"
          value={formData.pricePerDay}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            allErrors.pricePerDay ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: 45.00"
        />
        {allErrors.pricePerDay && (
          <p className="mt-1 text-sm text-red-600">{allErrors.pricePerDay}</p>
        )}
      </div>

      {/* Características */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
          Características (separadas por comas)
        </label>
        <textarea
          id="features"
          name="features"
          value={formData.features.join(', ')}
          onChange={handleFeaturesChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Aire acondicionado, GPS, Bluetooth, Cámara reversa"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separa cada característica con una coma
        </p>
      </div>

      {/* URL de imagen */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          URL de Imagen
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://ejemplo.com/imagen-vehiculo.jpg"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar Vehículo' : 'Crear Vehículo'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;