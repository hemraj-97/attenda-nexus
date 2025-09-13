import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, Teacher } from '../types';
import { authService } from '../services/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<Teacher>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    teacher: null,
  });
  const [loading, setLoading] = useState(false);

  // Check for existing auth on app start
  useEffect(() => {
    const savedAuth = localStorage.getItem('attendance_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setAuthState(parsed);
      } catch (error) {
        console.error('Failed to parse saved auth:', error);
        localStorage.removeItem('attendance_auth');
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const teacher = await authService.signIn({ email, password });
      const newAuthState = { isAuthenticated: true, teacher };
      setAuthState(newAuthState);
      localStorage.setItem('attendance_auth', JSON.stringify(newAuthState));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const teacher = await authService.signUp({ name, email, password });
      const newAuthState = { isAuthenticated: true, teacher };
      setAuthState(newAuthState);
      localStorage.setItem('attendance_auth', JSON.stringify(newAuthState));
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setAuthState({ isAuthenticated: false, teacher: null });
    localStorage.removeItem('attendance_auth');
  };

  const updateProfile = async (updates: Partial<Teacher>) => {
    if (!authState.teacher) throw new Error('No teacher logged in');
    
    setLoading(true);
    try {
      const updatedTeacher = await authService.updateProfile(updates);
      const newAuthState = { isAuthenticated: true, teacher: updatedTeacher };
      setAuthState(newAuthState);
      localStorage.setItem('attendance_auth', JSON.stringify(newAuthState));
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};