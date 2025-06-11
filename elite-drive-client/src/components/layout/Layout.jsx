import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, Bell, Search } from 'lucide-react';

const Header = ({ toggleSidebar, showSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 h-16 flex-shrink-0 transition-all duration-300 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Menu toggle and logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            title={showSidebar ? "Cerrar sidebar" : "Abrir sidebar"}
          >
            {/* Icono animado que cambia entre Menu y X */}
            <div className="relative w-5 h-5">
              <Menu 
                size={20} 
                className={`absolute inset-0 text-gray-700 transition-all duration-300 ${
                  showSidebar ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} 
              />
              <X 
                size={20} 
                className={`absolute inset-0 text-gray-700 transition-all duration-300 ${
                  showSidebar ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} 
              />
            </div>
          </button>

          {/* Logo - se oculta cuando el sidebar está abierto en desktop para evitar duplicación */}
          <div className={`transition-all duration-300 ${showSidebar ? 'md:opacity-0 md:scale-0' : 'opacity-100 scale-100'}`}>
            <img
              src="/EliteDrive.svg"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Search button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={18} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell size={18} className="text-gray-600" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User info - se adapta al estado del sidebar */}
          <div className={`flex items-center gap-2 transition-all duration-300 ${
            showSidebar ? 'md:opacity-0 md:scale-0' : 'opacity-100 scale-100'
          }`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.firstName || user?.name || 'Usuario'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;