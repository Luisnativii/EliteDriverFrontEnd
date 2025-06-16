class ReservationService {
    // Simular llamada a API para crear reserva
    static async createReservation(reservationData) {
        try {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Poner la llamada real la  API
            // const response = await fetch('/api/reservations', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(reservationData)
            // });
            
            // Simular respuesta exitosa
            const mockResponse = {
                id: Date.now(),
                ...reservationData,
                status: 'confirmed',
                createdAt: new Date().toISOString()
            };
            
            return {
                success: true,
                data: mockResponse
            };
        } catch (error) {
            console.error('Error creating reservation:', error);
            return {
                success: false,
                error: error.message || 'Error al crear la reserva'
            };
        }
    }

    // Validar datos de reserva
    static validateReservation(reservationData) {
        const errors = [];

        if (!reservationData.startDate) {
            errors.push('La fecha de inicio es requerida');
        }

        if (!reservationData.endDate) {
            errors.push('La fecha de fin es requerida');
        }

        if (reservationData.startDate && reservationData.endDate) {
            const startDate = new Date(reservationData.startDate);
            const endDate = new Date(reservationData.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate < today) {
                errors.push('La fecha de inicio no puede ser anterior a hoy');
            }

            if (endDate <= startDate) {
                errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
            }
        }

        if (!reservationData.vehicleId) {
            errors.push('ID del vehículo es requerido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Calcular precio total
    static calculateTotalPrice(startDate, endDate, pricePerDay) {
        if (!startDate || !endDate || !pricePerDay) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            days: diffDays > 0 ? diffDays : 0,
            totalPrice: diffDays > 0 ? diffDays * pricePerDay : 0
        };
    }
}

export default ReservationService;