import React from 'react';
import { useRegisterForm } from '../../hooks/useRegister';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        resetForm
    } = useRegisterForm();

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-y-auto scrollbar-show">
            {/* Imagen de fondo con overlay opaco */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
            
            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-2xl">
                {/* Logo */}
                <div className="text-center mb-2">
                    <div className='flex justify-center mt-4'>
                        <img
                            src="/EliteDrive.svg"
                            alt="EliteDrive Logo"
                            className="h-12 w-auto invert md:h-16 sm:h-12 lg:h-18"
                        />
                    </div>
                </div>

                {/* Formulario de registro */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-light text-white mb-2">Crear cuenta</h2>
                        <p className="text-white/70 text-sm">Completa la información para registrarte</p>
                    </div>

                    {errors.submit && (
                        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-white/90 text-sm font-medium" htmlFor="firstName">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.firstName 
                                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                    }`}
                                    placeholder="Tu nombre"
                                    required
                                />
                                {errors.firstName && (
                                    <p className="text-red-300 text-xs mt-1">{errors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-white/90 text-sm font-medium" htmlFor="lastName">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.lastName 
                                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                    }`}
                                    placeholder="Tu apellido"
                                    required
                                />
                                {errors.lastName && (
                                    <p className="text-red-300 text-xs mt-1">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Fecha de nacimiento */}
                        <div className="space-y-2">
                            <label className="block text-white/90 text-sm font-medium" htmlFor="birthDate">
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                                    errors.birthDate 
                                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                        : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                }`}
                                required
                            />
                            {errors.birthDate && (
                                <p className="text-red-300 text-xs mt-1">{errors.birthDate}</p>
                            )}
                        </div>

                        {/* DUI y Teléfono */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-white/90 text-sm font-medium" htmlFor="dui">
                                    DUI
                                </label>
                                <input
                                    type="text"
                                    id="dui"
                                    name="dui"
                                    value={formData.dui}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.dui 
                                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                    }`}
                                    placeholder="12345678"
                                    maxLength="8"
                                    pattern="[0-9]{8}"
                                    required
                                />
                                {errors.dui && (
                                    <p className="text-red-300 text-xs mt-1">{errors.dui}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-white/90 text-sm font-medium" htmlFor="phoneNumber">
                                    Número de teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.phoneNumber 
                                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                    }`}
                                    placeholder="12345678"
                                    maxLength="8"
                                    pattern="[0-9]{8}"
                                    required
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-300 text-xs mt-1">{errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-white/90 text-sm font-medium" htmlFor="email">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                    errors.email 
                                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                        : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                }`}
                                placeholder="tu@email.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-300 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Contraseñas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-white/90 text-sm font-medium" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.password 
                                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                    }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-white/90 text-sm font-medium" htmlFor="confirmPassword">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.confirmPassword 
                                            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                            : 'border-white/20 focus:ring-red-500/50 focus:border-red-500/50'
                                    }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mb-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50 transform transition-all duration-300 shadow-lg ${
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:from-red-700 hover:to-red-800 hover:scale-[1.02]'
                            }`}
                        >
                            {isLoading ? 'Registrando...' : 'Crear cuenta'}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-white/60">o</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLoginClick}
                            type="button"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                        >
                            Ya tengo una cuenta
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-white/50 text-xs">
                        2025 EliteDrive. N-Capas equipo Asesuisa.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;