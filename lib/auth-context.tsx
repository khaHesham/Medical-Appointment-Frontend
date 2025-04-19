'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi, LoginResponse } from '@/lib/axios';

type UserRole = 'patient' | 'doctor' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerPatient: (userData: any) => Promise<void>;
  registerDoctor: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole') as UserRole;

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await authApi.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.role);
      setIsAuthenticated(true);
      setUserRole(response.role as UserRole);

      toast.success('Login successful');
      router.push(response.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch (error) {
      throw Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const registerPatient = async (userData: any) => {
    try {
      const response = await authApi.registerPatient(userData);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw Error("Account exists!");
    }
  };

  const registerDoctor = async (userData: any) => {
    try {
      const response =  await authApi.registerDoctor(userData);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw Error("Account exists!");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
        registerPatient,
        registerDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
