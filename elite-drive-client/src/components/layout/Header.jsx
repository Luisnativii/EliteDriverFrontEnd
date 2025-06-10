import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ toggleSidebar, showSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex-shrink-0 ">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Menu toggle and search */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors "
            title={showSidebar ? "Ocultar sidebar" : "Mostrar sidebar"}
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 min-w-96 ">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 flex-1"
            />
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          

          {/* User dropdown */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName || user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;