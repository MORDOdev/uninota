import React, { useState } from 'react';
import { UserPlus, LogIn, KeyRound, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AlertDialog from './AlertDialog';

const Auth: React.FC = () => {
  const { login, register, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || (!isResetPassword && !password)) {
      setAlert({
        type: 'error',
        message: 'Por favor completa todos los campos'
      });
      return;
    }

    try {
      if (isResetPassword) {
        await resetPassword(email);
        setAlert({
          type: 'success',
          message: 'Se ha enviado un enlace de recuperación a tu correo'
        });
        return;
      }
      
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setAlert({
            type: 'error',
            message: 'Credenciales incorrectas'
          });
        }
      } else {
        if (password.length < 6) {
          setAlert({
            type: 'error',
            message: 'La contraseña debe tener al menos 6 caracteres'
          });
          return;
        }
        
        const success = await register(email, password);
        if (!success) {
          setAlert({
            type: 'error',
            message: 'Este correo ya está registrado'
          });
        }
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Ha ocurrido un error. Por favor intenta de nuevo.'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        {isResetPassword ? (
          <>
            <KeyRound className="mr-2 text-blue-600" size={24} />
            Recuperar Contraseña
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
            placeholder="tu@correo.com"
          />
        </div>
        
        {!isResetPassword && (
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
          {isResetPassword ? (
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
        {!isResetPassword && (
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
          onClick={() => setIsResetPassword(!isResetPassword)}
          className="text-gray-600 hover:text-gray-800 transition-colors text-sm block w-full text-center"
        >
          {isResetPassword ? 'Volver al inicio de sesión' : '¿Olvidaste tu contraseña?'}
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