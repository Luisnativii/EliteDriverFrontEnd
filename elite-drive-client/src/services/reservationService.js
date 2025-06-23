import { API_BASE_URL, API_ENDPOINTS, buildEndpoint } from '../config/apiConfig';


class ReservationService {
    //llamada a API para crear reserva
    static async createReservation(reservationData) {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const url = `${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.CREATE}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            const errorData = await response.json();

            // Intenta extraer el mensaje dentro del campo "error"
            const rawError = errorData?.error || 'Error al crear la reserva';

            // Si contiene un mensaje entre comillas, lo extraemos
            const match = rawError.match(/"([^"]+)"/);
            const cleanMessage = match && match[1] ? match[1] : rawError;

            throw new Error(cleanMessage);
        }
        const data = await response.json();
        return {
            success: true,
            data
        };
    }

    //eliminar reservacion
    static async deleteReservation(reservationId) {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        const url = `${API_BASE_URL}${buildEndpoint(API_ENDPOINTS.RESERVATIONS.CANCEL, { id: reservationId })}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Error al cancelar la reserva');
        }

        return { success: true };
    }


    //peticion de rango de fechas
    static async getReservationsByDateRange(startDate, endDate) {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const endpoint = buildEndpoint(API_ENDPOINTS.RESERVATIONS.GET_BY_DATE, { startDate, endDate });
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        return data;
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

    //obtener las reservaciones del usuario
    static async getReservationsByUser(userId) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    const url = `${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.GET_BY_USER}?userId=${userId}`;


    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al obtener reservas');
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : [];
    return { success: true, data };
}

}

export default ReservationService;