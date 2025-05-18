import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { getCurrentUser, setCurrentUser, clearCurrentUser, findUserByUsername, saveUser } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = findUserByUsername(username);
    if (user && user.password === password) {
      setCurrentUser(user);
      setAuthState({
        user,
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  };

  const register = (username: string, password: string): boolean => {
    // Check if username already exists
    if (findUserByUsername(username)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password,
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setAuthState({
      user: newUser,
      isAuthenticated: true,
    });
    return true;
  };

  const logout = () => {
    clearCurrentUser();
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};