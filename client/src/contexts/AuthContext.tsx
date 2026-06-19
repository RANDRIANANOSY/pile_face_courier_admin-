import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { mockUser } from '@/lib/mock-data';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Simulate loading and check if user is already logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          setAuthState({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
        }
      } else {
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock login - accept any email/password combination
    if (email && password) {
      const user: User = {
        ...mockUser,
        email,
      };
      localStorage.setItem('auth_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isLoading: authState.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
