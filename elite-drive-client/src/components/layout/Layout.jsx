import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../hooks/useLayout';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { user } = useAuth();
  const { showSidebar, isMobile, toggleSidebar } = useLayout();

  if (!user?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">No autorizado. Por favor, inicie sesión.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-900 w-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar with smooth transitions */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isMobile 
          ? `${showSidebar ? 'fixed translate-x-0' : 'fixed -translate-x-full'} top-0 left-0 h-screen z-50`
          : `${showSidebar ? 'w-64' : 'w-0'} relative overflow-hidden`
        }
      `}>
        <Sidebar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      </div>

      {/* Main content area */}
      <div className="bg-neutral-900 flex flex-col flex-1 overflow-hidden">
        {/* Header siempre visible */}
        <Header toggleSidebar={toggleSidebar} showSidebar={showSidebar && !isMobile} />
                
        {/* Main content with padding-top for fixed header */}
        <main className="
          flex-1 overflow-auto transition-all duration-300
          custom-scrollbar
        ">
          <div className="min-h-full">
            {/* Contenido principal con animación de entrada */}
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Estilos CSS personalizados mejorados */}
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

        /* Scrollbar personalizado más delgado con fondo negro */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color:rgb(56, 58, 61) #000000;
        }
                
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
                
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border-radius: 2px;
        }
                
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 2px;
        }
                
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background:rgb(68, 71, 76);
        }
      `}</style>
    </div>
  );
};

export default Layout;