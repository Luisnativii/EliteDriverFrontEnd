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

// Función para obtener reservaciones activas de hoy
static async getTodayReservations() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    try {
        const reservations = await this.getReservationsByDateRange(todayStr, todayStr);
        return reservations.filter(reservation => {
            // Filtrar solo las reservaciones que están activas hoy
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);
            const currentDate = new Date();
            
            // Normalizar las fechas para comparación (solo fecha, sin hora)
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            currentDate.setHours(0, 0, 0, 0);
            
            return currentDate >= startDate && currentDate <= endDate;
        });
    } catch (error) {
        console.error('Error al obtener reservaciones de hoy:', error);
        return [];
    }
}

// Función para verificar si un vehículo está reservado hoy
static async isVehicleReservedToday(vehicleId) {
    try {
        const todayReservations = await this.getTodayReservations();
        return todayReservations.some(reservation => 
            reservation.vehicle?.id === vehicleId  ||
                reservation.vehicleId === vehicleId ||
                reservation.vehicle_id === vehicleId
        );
    } catch (error) {
        console.error('Error al verificar reservación del vehículo:', error);
        return false;
    }
}

// Función para obtener todos los IDs de vehículos reservados hoy
static async getReservedVehicleIdsToday() {
    try {
        const todayReservations = await this.getTodayReservations();
        return todayReservations
            .map(reservation => reservation.vehicle?.id || 
                    reservation.vehicleId || 
                    reservation.vehicle_id)
            .filter(Boolean); // Filtrar valores null/undefined
    } catch (error) {
        console.error('Error al obtener IDs de vehículos reservados:', error);
        return [];
    }
}

    static async getReservedVehicleIdsInRange(startDate, endDate) {
        try {
            console.log('🔍 Obteniendo IDs de vehículos reservados entre:', startDate, 'y', endDate);
            
            const activeReservations = await this.getActiveReservationsInRange(startDate, endDate);
            const reservedIds = activeReservations
                .map(reservation => {
                    const vehicleId = reservation.vehicle?.id;
                    console.log('🚗 Reservación encontrada:', {
                        id: reservation.id,
                        vehicleId,
                        vehicleName: reservation.vehicle?.name,
                        startDate: reservation.startDate,
                        endDate: reservation.endDate
                    });
                    return vehicleId;
                })
                .filter(Boolean);
            
            // Eliminar duplicados si un vehículo tiene múltiples reservaciones
            const uniqueReservedIds = [...new Set(reservedIds)];
            
            console.log('✅ IDs únicos de vehículos reservados:', uniqueReservedIds);
            return uniqueReservedIds;
        } catch (error) {
            console.error('❌ Error al obtener vehículos reservados en el rango:', error);
            return [];
        }
    }

    static async getAllReservations() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const url = `${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.GET_ALL || '/reservations'}`;
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al obtener todas las reservas');
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        return data;
    }


}

export default ReservationService;