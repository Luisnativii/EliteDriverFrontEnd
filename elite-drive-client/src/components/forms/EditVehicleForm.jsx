// components/EditVehicleForm.jsx
import React from 'react';
import { useVehicleForm } from '../../hooks/useVehicleForm';
import { AlertCircle } from 'lucide-react';

const EditVehicleForm = ({ vehicle, onSubmit, onCancel, submitLoading = false }) => {
  const {
    formData,
    errors,
    handleChange,
    validateForm,
    setFormData,
    setErrors
  } = useVehicleForm(vehicle, true); // true = modo edición

  // Manejar cambio de kilómetros sin validación en tiempo real
  const handleKilometersChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');

    setFormData(prev => ({
      ...prev,
      kilometers: numericValue
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors.kilometers) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.kilometers;
        return newErrors;
      });
    }
  };

  // Manejar características
  const handleFeaturesChange = (e) => {
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      featuresText: value, // Texto tal como lo escribe el usuario
      features: value ? value.split(',').map(f => f.trim()).filter(f => f !== '') : []
    }));

    // Limpiar errores si los hay
    if (errors.features) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.features;
        return newErrors;
      });
    }
  };

  // Manejar URLs de imágenes adicionales
  const handleImageUrlsChange = (e) => {
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      imageUrlsText: value,
      imageUrls: value ? value.split(',').map(url => url.trim()).filter(url => url !== '') : []
    }));
  };

  // Calcular información de mantenimiento
  const calculateNextMaintenance = () => {
    if (!formData.kilometers || !vehicle.kmForMaintenance) return null;

    const currentKm = parseInt(formData.kilometers);
    const interval = parseInt(vehicle.kmForMaintenance);
    const nextMaintenanceKm = Math.ceil(currentKm / interval) * interval;
    const kmUntilMaintenance = nextMaintenanceKm - currentKm;

    return {
      nextMaintenanceKm,
      kmUntilMaintenance,
      isMaintenanceNeeded: kmUntilMaintenance === 0
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 Datos del formulario antes de enviar:', formData);
    
    // Validación especial para kilómetros en el submit
    if (vehicle.kilometers && parseInt(formData.kilometers) < parseInt(vehicle.kilometers)) {
      alert(`Los kilómetros no pueden ser menores a ${vehicle.kilometers}`);
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ Validación falló, errores:', errors);
      return;
    }

    // Preparar datos para actualización - solo campos editables
    const updateData = {
      pricePerDay: parseFloat(formData.pricePerDay),
      kilometers: parseInt(formData.kilometers),
      features: formData.featuresText
        ? formData.featuresText.split(',').map(f => f.trim()).filter(f => f !== '')
        : [],
      mainImageUrl: formData.mainImageUrl || '',
      imageUrls: formData.imageUrlsText
        ? formData.imageUrlsText.split(',').map(url => url.trim()).filter(url => url !== '')
        : []
    };

    console.log('🚀 Enviando datos de actualización:', updateData);
    console.log('🆔 ID del vehículo:', vehicle.id);

    try {
      await onSubmit(vehicle.id, updateData);
      console.log('✅ Actualización exitosa');
    } catch (error) {
      console.error('❌ Error al actualizar vehículo:', error);
      alert(`Error al actualizar el vehículo: ${error.message}`);
    }
  };

  if (!vehicle) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Cargando información del vehículo...</p>
      </div>
    );
  }

  return (
    <div className="border-none p-2">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información no editable - mostrar como texto */}
        <div className="p-4 rounded-lg mb-6">
          <div className="grid grid-row-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Nombre del Vehículo
              </label>
              <p className="text-gray-200 px-0 py-2 font-bold border-none">
                {vehicle.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Marca
              </label>
              <p className="text-gray-200 px-0 py-2 font-bold border-none">
                {vehicle.brand}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Modelo
              </label>
              <p className="text-gray-200 px-0 py-2 font-bold border-none">
                {vehicle.model}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Tipo de Vehículo
              </label>
              <p className="text-gray-200 px-0 py-2 font-bold border-none">
                {vehicle.type}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Capacidad (personas)
              </label>
              <p className="text-gray-200 px-0 py-2 font-bold border-none">
                {vehicle.capacity}
              </p>
            </div>

            {vehicle.kmForMaintenance && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Kilómetros para Mantenimiento
                </label>
                <p className="text-gray-200 px-0 py-2 font-bold border-none">
                  {vehicle.kmForMaintenance}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Campos editables */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Campos Editables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Precio por Día ($) *
              </label>
              <input
                type="text"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none text-white focus:ring-2 focus:ring-gray-500 ${
                  errors.pricePerDay ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 50.00"
              />
              {errors.pricePerDay && <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Kilómetros Actuales * 
                <span className="text-sm text-gray-400"> (mínimo: {vehicle.kilometers})</span>
              </label>
              <input
                type="text"
                name="kilometers"
                value={formData.kilometers}
                onChange={handleKilometersChange}
                className={`w-full px-3 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.kilometers ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Mínimo ${vehicle.kilometers}`}
              />
              
              {/* Información de mantenimiento */}
              {formData.kilometers && vehicle.kmForMaintenance && (() => {
                const maintenanceInfo = calculateNextMaintenance();
                if (!maintenanceInfo) return null;

                return (
                  <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center mb-1">
                      <AlertCircle className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-blue-200">
                        Información de Mantenimiento
                      </span>
                    </div>
                    <div className="text-xs text-blue-300 space-y-1">
                      <p>Próximo mantenimiento: {maintenanceInfo.nextMaintenanceKm.toLocaleString()} km</p>
                      {maintenanceInfo.isMaintenanceNeeded ? (
                        <p className="text-red-300 font-medium">
                          ⚠️ Mantenimiento requerido ahora
                        </p>
                      ) : (
                        <p>Faltan: {maintenanceInfo.kmUntilMaintenance.toLocaleString()} km</p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers}</p>}
            </div>
          </div>
        </div>

        {/* Características editables */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Características
          </label>
          <textarea
            name="featuresText"
            value={formData.featuresText}
            onChange={handleFeaturesChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Ej: Aire acondicionado, Bluetooth, GPS, Cámara trasera (separar con comas)"
          />
          <p className="text-sm text-gray-500 mt-1">Separa las características con comas</p>
          
          {/* Preview de características */}
          {formData.features && formData.features.length > 0 && (
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

        {/* URLs de imágenes editables */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            URL de Imagen Principal
          </label>
          <input
            type="url"
            name="mainImageUrl"
            value={formData.mainImageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="https://ejemplo.com/imagen-principal.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            URLs de Imágenes Adicionales (separadas por comas)
          </label>
          <textarea
            name="imageUrlsText"
            value={formData.imageUrlsText}
            onChange={handleImageUrlsChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg (separar con comas)"
          />
          <p className="text-sm text-gray-500 mt-1">Separa las URLs con comas</p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-white hover:bg-gray-50 hover:text-neutral-600"
            disabled={submitLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading ? 'Actualizando...' : 'Actualizar Vehículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicleForm;