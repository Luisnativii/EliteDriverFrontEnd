import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ toggleSidebar, showSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className={`
      bg-transparent border-none  h-20 flex-shrink-0 
     
      ${showSidebar ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'}
    `}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Menu toggle and logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg invert hover:bg-gray-100 transition-colors"
            title={showSidebar ? "Ocultar sidebar" : "Mostrar sidebar"}
          >
            <Menu size={20} className="text-black" />
          </button>

          <img
            src="/EliteDrive.svg"
            alt="Logo"
            className="h-12 w-auto invert"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;