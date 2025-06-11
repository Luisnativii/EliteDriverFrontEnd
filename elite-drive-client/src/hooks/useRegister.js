// hooks/useRegisterForm.js
import { useState } from 'react';

export const useRegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        dui: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Formateo especial para DUI (solo números)
        if (name === 'dui') {
            const numericValue = value.replace(/\D/g, '').slice(0, 8);
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        }
        // Formateo especial para número de teléfono (solo números)
        else if (name === 'phoneNumber') {
            const numericValue = value.replace(/\D/g, '').slice(0, 8);
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
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación de nombre
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
        }

        // Validación de apellido
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        // Validación de fecha de nacimiento
        if (!formData.birthDate) {
            newErrors.birthDate = 'La fecha de nacimiento es requerida';
        } else {
            const today = new Date();
            const birthDate = new Date(formData.birthDate);
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 18) {
                newErrors.birthDate = 'Debes ser mayor de 18 años';
            } else if (age > 100) {
                newErrors.birthDate = 'Por favor verifica la fecha de nacimiento';
            }
        }

        // Validación de DUI
        if (!formData.dui) {
            newErrors.dui = 'El DUI es requerido';
        } else if (formData.dui.length !== 8) {
            newErrors.dui = 'El DUI debe tener 8 dígitos';
        }

        // Validación de teléfono
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'El número de teléfono es requerido';
        } else if (formData.phoneNumber.length !== 8) {
            newErrors.phoneNumber = 'El número de teléfono debe tener 8 dígitos';
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        // Validación de contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validación de confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmación de contraseña es requerida';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Aquí irá la lógica de registro
            console.log('Datos del formulario:', formData);
            
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reset form después del éxito
            setFormData({
                firstName: '',
                lastName: '',
                birthDate: '',
                dui: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            
            alert('Registro exitoso!');
            
        } catch (error) {
            console.error('Error en el registro:', error);
            setErrors({ submit: 'Error al procesar el registro. Intenta nuevamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            birthDate: '',
            dui: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        resetForm,
        validateForm
    };
};