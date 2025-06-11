import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Set sidebar to closed by default on mobile
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }

    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (!user?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">No autorizado. Por favor, inicie sesión.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 w-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar with smooth transitions */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${showSidebar 
          ? (isMobile ? 'fixed top-0 left-0 h-screen z-30 translate-x-0' : 'relative translate-x-0 w-64') 
          : (isMobile ? 'fixed top-0 left-0 h-screen z-30 -translate-x-full' : 'relative -translate-x-full w-0')
        }
      `}>
        <Sidebar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header siempre visible */}
        <Header toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
        
        {/* Main content with smooth transitions */}
        <main className={`
          flex-1 overflow-auto bg-neutral-50 transition-all duration-300
          ${showSidebar && !isMobile ? 'ml-0' : 'ml-0'}
        `}>
          <div className="p-6">
            {/* Contenido principal con animación de entrada */}
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hide-scrollbar-x {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .hide-scrollbar-x::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Layout;