import CarroPaginaHomeBanner from '../../assets/jpg/CarroPaginaHomeBanner.jpg';


const MainHomeSection = () => {
    return (        
        <section
            className="relative min-h-screen bg-cover bg-center flex items-center justify-between px-8 lg:px-16 font-montserrat z-10"
            style={{ backgroundImage: `url(${CarroPaginaHomeBanner})` }}
        >

            
            <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">

                {/* Lado izquierdo - Título y subtítulo */}
                <div className="text-left">
                    <h1 className="text-8xl lg:text-8xl font-extralight text-red-50 mb-4">
                        ELITE<br />DRIVE
                    </h1>
                    <p className="text-sm  lg:text-lg text-white">
                        Encuentra tu libertad en cada viaje
                    </p>
                </div>

                <div className="bg-white p-2 rounded-lg shadow-lg min-w-[500px] m-auto  ">
                
                    <div className="flex items-center gap-4">
                        <label className="text-gray-700 font-medium">
                            Desde:
                        </label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <label className="text-gray-700 font-medium">
                            Hasta:
                        </label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>


        </section>

    );
}

export default MainHomeSection;


{/* section bonito
    
    
    
    
    
    
    */}