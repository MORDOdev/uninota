import React, { useState } from 'react';
import { UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AlertDialog from './AlertDialog';

const Auth: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info', message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setAlert({
        type: 'error',
        message: 'Por favor ingresa tu nombre de usuario y contraseña'
      });
      return;
    }
    
    if (isLogin) {
      // Login
      const success = login(username, password);
      if (!success) {
        setAlert({
          type: 'error',
          message: 'Usuario o contraseña incorrectos'
        });
      }
    } else {
      // Register
      if (username.length < 3) {
        setAlert({
          type: 'error',
          message: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
        return;
      }
      
      if (password.length < 6) {
        setAlert({
          type: 'error',
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
      }
      
      const success = register(username, password);
      if (!success) {
        setAlert({
          type: 'error',
          message: 'Este nombre de usuario ya está en uso'
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        {isLogin ? (
          <>
            <LogIn className="mr-2 text-blue-600" size={24} />
            Iniciar Sesión
          </>
        ) : (
          <>
            <UserPlus className="mr-2 text-blue-600" size={24} />
            Registrarse
          </>
        )}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isLogin ? (
            <>
              <LogIn size={18} className="mr-1" />
              Iniciar Sesión
            </>
          ) : (
            <>
              <UserPlus size={18} className="mr-1" />
              Registrarse
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
      
      {alert && (
        <AlertDialog
          type={alert.type}
          message={alert.message}
          isOpen={!!alert}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default Auth;