import CarroPaginaHomeBanner from '../../assets/jpg/CarroPaginaHomeBanner.jpg';
import DateForm from '../../components/forms/DateForm';

const MainHomeSection = () => {
    return (
        <section
  className="relative min-h-screen bg-cover bg-center flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-16 font-montserrat"
  style={{ backgroundImage: `url(${CarroPaginaHomeBanner})` }}
>
  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-8">
    
    {/* Título */}
    <div className="text-center md:text-left">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white mb-4 leading-tight drop-shadow-2xl">
        <span className="block">ELITE</span>
        <span className="block">DRIVE</span>
      </h1>
      <p className="text-base sm:text-lg text-white/90 drop-shadow-lg max-w-xs sm:max-w-md mx-auto md:mx-0">
        Encuentra tu libertad en cada viaje
      </p>
    </div>

    {/* Formulario de fechas */}
    <DateForm variant="home" />
  </div>
</section>

    );
}

export default MainHomeSection;