import { useState, useEffect } from 'react';
// Si más adelante querés filtrar por fechas, podés importar tu contexto:
// import { useDateContext } from '../context/DateContext';

// Datos dummy (serán reemplazados por los del backend)

// Datos dummy - luego reemplazar con llamadas a API
const dummyVehicles = [
    { 
        id: 1, 
        name: 'Honda Civic', 
        Brand: 'Honda' ,
        model : '2023', 
        capacity: 5 ,   
        type: 'Sedán', 
        price: 34.00, 
        image: 'https://resizer.glanacion.com/resizer/v2/el-toyota-corolla-renovado-en-2023-por-la-marca-7H7VB2REHZERRL4YJDG5ECG5GE.jpg?auth=33c3e83626046ba0c595eba9505419d30d47c5e62ed93073e5afdcdb87b1801c&width=1280&height=854&quality=70&smart=true', 
        features: ['Aire Acondicionado', 'Bluetooth', 'Cámara Trasera', 'Control de Crucero'] },
    { 
        id: 2, 
        name: 'Toyota Corolla',
        Brand: 'Toyoya' ,
        model : '2022', 
        capacity: 5, 
        type: 'Sedán', 
        price: 35.00, 
        image: 'https://cdn.motor1.com/images/mgl/P3gQyK/s1/corolla-grs-1.webp',
        features: ['Aire Acondicionado', 'Sistema de Navegación', 'Android Auto', 'Apple CarPlay', 'Sensores de Estacionamiento'] },
    { 
        id: 3, 
        name: 'BMW X5',
        Brand: 'BMW' ,
        model : '2023', 
        capacity: 7 , 
        type: 'SUV', 
        price: 42.00, 
        image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg',  
        features: ['Tracción 4x4', 'Asientos de Cuero', 'Techo Panorámico', 'Sistema de Sonido Premium', 'Arranque sin Llave']},
    { 
        id: 4, 
        name: 'Ford ranger',
        Brand: 'Ford' ,
        model : '2020', 
        capacity: 5, 
        type: 'PickUP', 
        price: 32.00, 
        image: 'https://cdn.motor1.com/images/mgl/zxq9Z8/s1/2025-ford-ranger-phev-europe.jpg',
        features: ['Tracción 4x4', 'Caja de Carga', 'Ganchos de Remolque', 'Aire Acondicionado', 'Bluetooth']
}
];

// Simula delay de API para hacer más realista
const simulateApiDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Hook para obtener todos los vehículos
export const useVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            setError(null);

              // 🔽 Cuando esté listo el backend, reemplazá esto:
            // const response = await fetch('/api/vehicles');
            // const data = await response.json();
            // setVehicles(data);

            // 🔼 Por ahora, se usan datos dummy:
            // Simula llamada a API
            await simulateApiDelay();
            setVehicles(dummyVehicles);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return { 
        vehicles, 
        loading, 
        error, 
        refetch: fetchVehicles 
    };
};

// Hook para obtener un vehículo específico por ID
export const useVehicle = (id) => {
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);

                 // 🔽 En producción:
                // const response = await fetch(`/api/vehicles/${id}`);
                // const data = await response.json();
                // setVehicle(data);

                // 🔼 Por ahora:
                // Simula llamada a API
                await simulateApiDelay();
                const foundVehicle = dummyVehicles.find(v => v.id === parseInt(id));
                if (!foundVehicle) {
                    throw new Error('Vehículo no encontrado');
                }
                setVehicle(foundVehicle);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    return { 
        vehicle, 
        loading, 
        error 
    };
};

// Hook para obtener vehículos filtrados por tipo
export const useVehiclesByType = (type = 'all') => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehiclesByType = async () => {
            try {
                setLoading(true);
                setError(null);

                 // 🔽 En producción:
                // const response = await fetch(`/api/vehicles?type=${type}`);
                // const data = await response.json();
                // setVehicles(data);
                
                // Simula llamada a API
                await simulateApiDelay(500);
                const filteredVehicles = type === 'all' 
                    ? dummyVehicles 
                    : dummyVehicles.filter(v => v.type === type);
                
                setVehicles(filteredVehicles);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehiclesByType();
    }, [type]);

    return { 
        vehicles, 
        loading, 
        error 
    };
};