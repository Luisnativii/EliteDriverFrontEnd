// Manejo de estado y efectos para componentes React
import { useState } from 'react';
import ReservationService from '../services/reservationService';

export const useReservation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createReservation = async (reservationData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Validar datos antes de enviar
            const validation = ReservationService.validateReservation(reservationData);
            
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Crear la reserva
            const result = await ReservationService.createReservation(reservationData);
            
            if (!result.success) {
                throw new Error(result.error);
            }

            setIsLoading(false);
            return {
                success: true,
                data: result.data
            };

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            return {
                success: false,
                error: err.message
            };
        }
    };

    const calculatePrice = (startDate, endDate, pricePerDay) => {
        return ReservationService.calculateTotalPrice(startDate, endDate, pricePerDay);
    };

    const validateDates = (startDate, endDate) => {
        const validation = ReservationService.validateReservation({
            startDate,
            endDate,
            vehicleId: 'temp' // Solo para validación de fechas
        });

        return {
            isValid: validation.errors.length <= 1, // Ignorar error de vehicleId
            errors: validation.errors.filter(err => !err.includes('vehicleId'))
        };
    };

    return {
        createReservation,
        calculatePrice,
        validateDates,
        isLoading,
        error,
        clearError: () => setError(null)
    };
};