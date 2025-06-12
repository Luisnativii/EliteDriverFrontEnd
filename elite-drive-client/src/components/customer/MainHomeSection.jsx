import CarroPaginaHomeBanner from '../../assets/jpg/CarroPaginaHomeBanner.jpg';

const MainHomeSection = () => {
    return (
        <section
            className="relative min-h-screen bg-cover bg-center flex items-center justify-between px-8 lg:px-16 font-montserrat"
            style={{ backgroundImage: `url(${CarroPaginaHomeBanner})` }}
        >
            {/* Overlay para mejorar legibilidad */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
                {/* Lado izquierdo - Título y subtítulo */}
                <div className="text-left">
                    <h1 className="text-6xl lg:text-8xl font-extralight text-white mb-6 leading-tight">
                        <span className="block drop-shadow-2xl">ELITE</span>
                        <span className="block drop-shadow-2xl">DRIVE</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-white/90 drop-shadow-lg max-w-md">
                        Encuentra tu libertad en cada viaje
                    </p>
                </div>

                {/* Formulario de reserva con glassmorphism */}
                <div className="
                    bg-white/10 backdrop-blur-md p-6 rounded-2xl 
                    shadow-2xl border border-white/20 min-w-[700px] 
                    hover:bg-white/15 transition-all duration-300
                ">
                    <h3 className="text-white text-lg font-semibold mb-4 text-center">
                        Reserva tu vehículo
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-white/90 font-medium text-sm block mb-2">
                                    Desde:
                                </label>
                                <input
                                    type="date"
                                    className="
                                        w-full bg-white/20 backdrop-blur-sm border border-white/30 
                                        rounded-lg px-4 py-3 text-white placeholder-white/60
                                        focus:outline-none focus:ring-2 focus:ring-white/50 
                                        focus:border-transparent transition-all duration-200
                                        hover:bg-white/25
                                    "
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-white/90 font-medium text-sm block mb-2">
                                    Hasta:
                                </label>
                                <input
                                    type="date"
                                    className="
                                        w-full bg-white/20 backdrop-blur-sm border border-white/30 
                                        rounded-lg px-4 py-3 text-white placeholder-white/60
                                        focus:outline-none focus:ring-2 focus:ring-white/50 
                                        focus:border-transparent transition-all duration-200
                                        hover:bg-white/25
                                    "
                                />
                            </div>
                        </div>

                        {/* Botón de búsqueda */}
                        <button className="
                            w-full bg-gradient-to-r from-black to-neutral-500 
                            hover:from-black hover:to-red-200
                            text-white font-semibold py-3 px-6 rounded-lg
                            transition-all duration-200 transform hover:scale-105
                            shadow-lg hover:shadow-xl
                            focus:outline-none focus:ring-2 focus:ring-white/50
                        ">
                            Buscar Vehículos
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MainHomeSection;