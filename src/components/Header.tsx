import React from 'react';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap size={28} />
          <h1 className="text-2xl font-bold">uninotas</h1>
        </div>
        
        {isAuthenticated && user && (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block">
              Bienvenido, <span className="font-semibold">{user.username}</span>
            </span>
            <button 
              onClick={logout}
              className="flex items-center space-x-1 bg-blue-800 hover:bg-blue-900 transition-colors py-1 px-3 rounded-md"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline-block">Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;