import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
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
            <div className="relative z-10 w-full max-w-md">
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

                {/* Formulario de login */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-light text-white mb-2">Inicio de sesión</h2>
                        <p className="text-white/70 text-sm">Ingresa tus credenciales</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-white/90 text-sm font-medium" htmlFor="email">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white/90 text-sm font-medium" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-white/70">
                                <input type="checkbox" className="mr-2 rounded" />
                                Recordarme
                            </label>
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full mb-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                        >
                            Iniciar sesión
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
                            onClick={handleRegisterClick}
                            type="button"
                            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                        >
                            Crear nueva cuenta
                        </button>
                    </div>
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

export default Login;