import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDateContext } from '../../context/DateContext';

const DateForm = ({ variant = 'default', onSearch }) => {
    const navigate = useNavigate();
    const { startDate, endDate, setStartDate, setEndDate } = useDateContext();

    const handleSearch = () => {
        if (onSearch) {
            onSearch({ startDate, endDate });
        } else {
            navigate('/customer/vehicles');
        }
    };

    // Estilos para la variante de home (glassmorphism)
    const homeStyles = {
        container: `
        w-full max-w-[700px] mx-auto
        bg-white/10 backdrop-blur-md py-6 px-6 sm:px-8 rounded-3xl 
        shadow-2xl border border-white/20
        hover:bg-white/15 transition-all duration-300
    `,
        title: "text-white text-lg font-semibold mb-4 text-center",
        label: "text-white/90 font-medium text-sm block mb-2",
        input: `
            w-full bg-white/20 backdrop-blur-sm border border-white/30 
            rounded-lg px-4 py-3 text-white placeholder-white/60
            focus:outline-none focus:ring-2 focus:ring-white/50 
            focus:border-transparent transition-all duration-200
            hover:bg-white/25
        `,
        button: `
            w-full bg-gradient-to-r from-black to-neutral-700 
            hover:from-black hover:to-white
            text-white font-semibold py-3 px-6 rounded-lg
            transition-all duration-200 transform hover:scale-105
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-white/50
        `
    };

    // Estilos para la variante de vehicles (compacto y horizontal)
    const vehiclesStyles = {
        container: "flex items-center gap-4",
        title: "text-white text-sm font-medium",
        label: "text-white font-medium text-xs block mb-1",
        input: `
            border border-gray-300 px-0 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-neutral-500 
            focus:border-transparent transition-all duration-200
            w-38
        `,
        button: `
            bg-neutral-800 hover:bg-neutral-600
            text-white font-semibold py-2 px-4 rounded-lg text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-neutral-500
        `
    };

    const styles = variant === 'home' ? homeStyles : vehiclesStyles;

    if (variant === 'vehicles') {
        return (
            <div className={styles.container}>
            
                
                <div>
                    <label className={styles.label}>Desde:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={styles.input}
                    />
                </div>

                <div>
                    <label className={styles.label}>Hasta:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className={styles.input}
                    />
                </div>
            </div>
        );
    }

    // Layout original para la variante home
    return (
        <div className={`${styles.container} flex flex-col sm:flex-row gap-4`}>

    <div className="flex-1">
        <label className={styles.label}>Desde:</label>
        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={styles.input}
        />
    </div>

    <div className="flex-1">
        <label className={styles.label}>Hasta:</label>
        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
            className={styles.input}
        />
    </div>

    {/* 🔘 Botón de búsqueda */}
    <button
        type="button"
        onClick={handleSearch}
        className={`${styles.button} mt-4 sm:mt-0 sm:col-span-2`}
    >
        Buscar Vehículos
    </button>

</div>


    );
};

export default DateForm;