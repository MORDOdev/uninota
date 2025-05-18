import React, { useState } from 'react';
import { UserPlus, LogIn, Mail, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AlertDialog from './AlertDialog';

const Auth: React.FC = () => {
  const { login, register, resetPassword, continueAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || (!isResetting && !password)) {
      setAlert({
        type: 'error',
        message: 'Por favor completa todos los campos'
      });
      return;
    }

    try {
      if (isResetting) {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setAlert({
          type: 'success',
          message: 'Se ha enviado un enlace de recuperación a tu correo'
        });
        setIsResetting(false);
      } else if (isLogin) {
        const { error } = await login(email, password);
        if (error) throw error;
      } else {
        const { error } = await register(email, password);
        if (error) throw error;
        setAlert({
          type: 'success',
          message: 'Registro exitoso. Por favor verifica tu correo.'
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Ha ocurrido un error'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        {isResetting ? (
          <>
            <Mail className="mr-2 text-blue-600" size={24} />
            Restablecer Contraseña
          </>
        ) : isLogin ? (
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        {!isResetting && (
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
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isResetting ? (
            <>
              <Mail size={18} className="mr-1" />
              Enviar Correo de Recuperación
            </>
          ) : isLogin ? (
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
      
      <div className="mt-4 space-y-2">
        {!isResetting && (
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm block w-full text-center"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        )}
        
        <button
          type="button"
          onClick={() => setIsResetting(!isResetting)}
          className="text-blue-600 hover:text-blue-800 transition-colors text-sm block w-full text-center"
        >
          {isResetting ? 'Volver al inicio de sesión' : '¿Olvidaste tu contraseña?'}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o</span>
          </div>
        </div>

        <button
          type="button"
          onClick={continueAsGuest}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <ExternalLink size={18} className="mr-1" />
          Continuar sin Cuenta
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