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
    <div className="flex h-screen w-screen overflow-hidden relative bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar with conditional positioning */}
      {showSidebar && (
        <div className={`
          transition-all duration-300
          ${isMobile ? 'fixed top-0 left-0 h-screen z-30' : 'relative'}
        `}>
          <Sidebar toggleSidebar={toggleSidebar} isMobile={isMobile} />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
        <main className="flex-1 overflow-auto bg-gray-50 overflow-x-auto hide-scrollbar-x ">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;