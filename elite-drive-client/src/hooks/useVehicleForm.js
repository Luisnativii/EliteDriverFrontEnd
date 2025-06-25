import { useState, useCallback } from 'react';

export const useVehicleForm = (initialData = {}, isEditMode = false) => {
  const [formData, setFormData] = useState({
    // Campos que siempre se muestran
    name: '',
    brand: '',
    model: '',
    capacity: '',
    vehicleType: '',
    pricePerDay: '',
    kilometers: '',
    features: [],
    image: null,
    mainImageUrl: initialData.mainImageUrl || '',
    kmForMaintenance: initialData.kmForMaintenance?.toString() || '',
    imageUrlsText: Array.isArray(initialData.imageUrls)
      ? initialData.imageUrls.join(', ')
      : (initialData.imageUrls || ''),
    // Texto editable para características
    featuresText: (() => {
      if (initialData.features) {
        if (Array.isArray(initialData.features)) {
          return initialData.features.join(', ');
        } else if (typeof initialData.features === 'string') {
          return initialData.features;
        }
      }
      return '';
    })(),
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Formateo especial para campos numéricos
    if (name === 'capacity' || name === 'kilometers') {
      const numericValue = value.replace(/\D/g, '');

      // Validación especial para kilómetros en modo edición
      if (name === 'kilometers' && isEditMode && initialData.kilometers) {
        const newKilometers = parseInt(numericValue);
        const originalKilometers = parseInt(initialData.kilometers);

        if (numericValue && newKilometers < originalKilometers) {
          // No actualizar el valor y mostrar error
          setErrors(prev => ({
            ...prev,
            kilometers: `Los kilómetros no pueden ser menores a ${originalKilometers}`
          }));
          return; // No actualizar el formData
        }
      }

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
    // Formateo especial para precio
    else if (name === 'pricePerDay') {
      const numericValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error específico cuando el usuario empieza a escribir
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, [isEditMode, initialData.kilometers]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // En modo edición, solo validar campos editables
    if (isEditMode) {
      if (!formData.pricePerDay) {
        newErrors.pricePerDay = 'El precio por día es requerido';
      } else if (parseFloat(formData.pricePerDay) <= 0) {
        newErrors.pricePerDay = 'El precio debe ser mayor a 0';
      }

      if (!formData.kilometers) {
        newErrors.kilometers = 'Los kilómetros son requeridos';
      } else if (parseInt(formData.kilometers) < 0) {
        newErrors.kilometers = 'Los kilómetros no pueden ser negativos';
      } else if (initialData.kilometers && parseInt(formData.kilometers) < parseInt(initialData.kilometers)) {
        newErrors.kilometers = `Los kilómetros no pueden ser menores a ${initialData.kilometers}`;
      }
    } else {
      // Validaciones completas para creación
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre del vehículo es requerido';
      }

      if (!formData.brand.trim()) {
        newErrors.brand = 'La marca es requerida';
      }

      if (!formData.model.trim()) {
        newErrors.model = 'El modelo es requerido';
      }

      if (!formData.capacity) {
        newErrors.capacity = 'La capacidad es requerida';
      } else if (parseInt(formData.capacity) < 1 || parseInt(formData.capacity) > 50) {
        newErrors.capacity = 'La capacidad debe estar entre 1 y 50 personas';
      }

      if (!formData.vehicleType) {
        newErrors.vehicleType = 'El tipo de vehículo es requerido';
      }

      if (!formData.pricePerDay) {
        newErrors.pricePerDay = 'El precio por día es requerido';
      } else if (parseFloat(formData.pricePerDay) <= 0) {
        newErrors.pricePerDay = 'El precio debe ser mayor a 0';
      }

      if (!formData.kilometers) {
        newErrors.kilometers = 'Los kilómetros son requeridos';
      } else if (parseInt(formData.kilometers) < 0) {
        newErrors.kilometers = 'Los kilómetros no pueden ser negativos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditMode, initialData.kilometers]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      capacity: '',
      vehicleType: '',
      pricePerDay: '',
      kilometers: '',
      features: [],
      image: null,
      ...initialData,
      featuresText: initialData.features ? initialData.features.join(', ') : ''
    });
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setErrors,
    setIsLoading
  };
};