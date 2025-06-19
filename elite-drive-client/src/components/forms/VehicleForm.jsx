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
    vehicleType: vehicle.type || '',
    pricePerDay: vehicle.price?.toString() || '',
    kilometers: vehicle.kilometers?.toString() || '',
    features: vehicle.features || [],
    image: vehicle.image || null
  } : {});

  // Opciones para el select de tipo de vehículo
  const vehicleTypes = [
    { value: '', label: 'Selecciona un tipo' },
    { value: 'Sedan', label: 'Sedán' },
    { value: 'SUV', label: 'SUV' },
    { value: 'PickUp', label: 'Pickup' },
  ];

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  // Manejar características - CORREGIDO
  const handleFeaturesChange = (e) => {
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      featuresText: value, // Texto tal como lo escribe el usuario
      features: value ? value.split(',').map(f => f.trim()).filter(f => f !== '') : []
    }));

    // Limpiar errores si los hay
    if (formErrors.features) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.features;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // CORRECCIÓN: Procesar las features correctamente
      const submitData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        capacity: parseInt(formData.capacity),
        vehicleType: formData.vehicleType,
        pricePerDay: parseFloat(formData.pricePerDay),
        kilometers: parseInt(formData.kilometers),
        features: formData.featuresText
          ? formData.featuresText.split(',').map(f => f.trim()).filter(f => f !== '')
          : [],
        image: formData.image
      };

      console.log('🔧 Datos a enviar:', submitData);

      if (isEditing) {
        await updateVehicle(vehicle.id, submitData, onSuccess);
      } else {
        await createVehicle(submitData, onSuccess);
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
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-200 font-medium">
              {errors.create || errors.update}
            </span>
          </div>
        </div>
      )}

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
            <Car className="w-4 h-4 inline mr-2" />
            Nombre del Vehículo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 ${allErrors.name ? 'border-red-500/50' : 'border-white/20'
              }`}
            placeholder="Ej: Toyota Corolla 2023"
          />
          {allErrors.name && (
            <p className="mt-2 text-sm text-red-300">{allErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="vehicleType" className="block text-sm font-semibold text-white mb-2">
            Tipo de Vehículo *
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent appearance-none transition-all duration-300 hover:bg-white/15 ${allErrors.vehicleType ? 'border-red-500/50' : 'border-white/20'
              }`}
          >
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-gray-900 text-white">
                {type.label}
              </option>
            ))}
          </select>
          {allErrors.vehicleType && (
            <p className="mt-2 text-sm text-red-300">{allErrors.vehicleType}</p>
          )}
        </div>
      </div>

      {/* Marca y Modelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className="block text-sm font-semibold text-white mb-2">
            Marca *
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 ${allErrors.brand ? 'border-red-500/50' : 'border-white/20'
              }`}
            placeholder="Ej: Toyota"
          />
          {allErrors.brand && (
            <p className="mt-2 text-sm text-red-300">{allErrors.brand}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-semibold text-white mb-2">
            Modelo *
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 ${allErrors.model ? 'border-red-500/50' : 'border-white/20'
              }`}
            placeholder="Ej: Corolla"
          />
          {allErrors.model && (
            <p className="mt-2 text-sm text-red-300">{allErrors.model}</p>
          )}
        </div>
      </div>

      {/* Capacidad y Kilómetros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="capacity" className="block text-sm font-semibold text-white mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Capacidad (personas) *
          </label>
          <input
            type="text"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 ${allErrors.capacity ? 'border-red-500/50' : 'border-white/20'
              }`}
            placeholder="Ej: 5"
          />
          {allErrors.capacity && (
            <p className="mt-2 text-sm text-red-300">{allErrors.capacity}</p>
          )}
        </div>

        <div>
          <label htmlFor="kilometers" className="block text-sm font-semibold text-white mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Kilómetros *
          </label>
          <input
            type="text"
            id="kilometers"
            name="kilometers"
            value={formData.kilometers}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 ${allErrors.kilometers ? 'border-red-500/50' : 'border-white/20'
              }`}
            placeholder="Ej: 50000"
          />
          {allErrors.kilometers && (
            <p className="mt-2 text-sm text-red-300">{allErrors.kilometers}</p>
          )}
        </div>
      </div>

      {/* Precio */}
      <div>
        <label htmlFor="pricePerDay" className="block text-sm font-semibold text-white mb-2">
          <DollarSign className="w-4 h-4 inline mr-2" />
          Precio por Día (USD) *
        </label>
        <input
          type="text"
          id="pricePerDay"
          name="pricePerDay"
          value={formData.pricePerDay}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 ${allErrors.pricePerDay ? 'border-red-500/50' : 'border-white/20'
            }`}
          placeholder="Ej: 45.00"
        />
        {allErrors.pricePerDay && (
          <p className="mt-2 text-sm text-red-300">{allErrors.pricePerDay}</p>
        )}
      </div>

      {/* Características - CORREGIDO */}
      <div>
        <label htmlFor="features" className="block text-sm font-semibold text-white mb-2">
          Características (separadas por comas)
        </label>
        <textarea
          id="features"
          name="features"
          value={formData.featuresText || (Array.isArray(formData.features) ? formData.features.join(', ') : '')}
          onChange={handleFeaturesChange}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
          placeholder="Ej: Aire acondicionado, GPS, Bluetooth, Cámara reversa"
        />
        <p className="mt-2 text-xs text-white/60">
          Separa cada característica con una coma
        </p>
        {/* Preview de características */}
        {formData.features.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full border border-blue-500/30"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* URL de imagen */}
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-white mb-2">
          URL de Imagen
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
          placeholder="https://ejemplo.com/imagen-vehiculo.jpg"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 flex items-center font-medium"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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