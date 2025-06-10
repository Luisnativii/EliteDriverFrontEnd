import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createContext, useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Home, 
  Car, 
  Calendar, 
  Settings, 
  User, 
  LogOut,
  Users,
  Wrench,
  Clock,
  BookOpen
} from "lucide-react";

// Mapeo de roles a configuración
const roleConfig = {
  admin: { 
    title: "Panel Administrativo",
    subtitle: "EliteDrive Admin"
  },
  customer: { 
    title: "Portal Cliente",
    subtitle: "EliteDrive"
  }
};

// Mapeo de iconos
const iconMap = {
  Home,
  Car,
  Calendar,
  Settings,
  User,
  Users,
  Wrench,
  Clock,
  BookOpen,
  LogOut
};

const SidebarContext = createContext();

const Sidebar = ({ toggleSidebar, isMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.routeRole || "customer";


  const menuOptions = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: "Home" },
      { name: "Gestión de Vehículos", path: "/admin/vehicle", icon: "Car" },
      { name: "Gestión de Reservas", path: "/admin/reservation", icon: "Calendar" },
      { name: "Mantenimiento", path: "/admin/maintenance", icon: "Wrench" },
    ],
    customer: [
      { name: "Inicio", path: "/customer", icon: "Home" },
      { name: "Vehículos", path: "/customer/vehicles", icon: "Car" },
      { name: "Hacer Reserva", path: "/customer/reservation-page", icon: "Calendar" },
      { name: "Mis Reservas", path: "/customer/my-reservations", icon: "BookOpen" },
    ],
  };

  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const isActivePath = (path) => {
    if (path === `/${role}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="h-full">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm min-w-64">
        {/* Header del Sidebar */}
        <div className="px-4 pt-6 pb-4 flex justify-between items-center border-b">
          <div className="flex flex-col">
            <span className="font-bold text-xl text-blue-600">{roleConfig[role].subtitle}</span>
            <span className="text-sm text-gray-500">{roleConfig[role].title}</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMobile ? "Cerrar sidebar" : "Colapsar sidebar"}
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Menú de navegación */}
        <SidebarContext.Provider value={{ open: true }}>
          <ul className="flex-1 px-3 py-4 space-y-1">
            {menuOptions[role]?.map(({ name, path, icon }) => {
              const IconComponent = iconMap[icon];
              const isActive = isActivePath(path);
              
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg
                      font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }
                    `}
                  >
                    {IconComponent && (
                      <IconComponent 
                        size={20} 
                        className={isActive ? 'text-blue-600' : 'text-gray-500'} 
                      />
                    )}
                    <span className="text-sm">{name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SidebarContext.Provider>

        {/* Footer del usuario */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {user?.firstName || user?.name || "Usuario"}
              </h4>
              <span className="text-xs text-gray-500 truncate block">
                {user?.email || "No disponible"}
              </span>
              <span className="text-xs text-blue-600 font-medium">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;