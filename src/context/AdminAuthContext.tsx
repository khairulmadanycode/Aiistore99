import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/store';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string; message?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('aiistore99_admin_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify stored token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
        } else {
          // Token invalid
          localStorage.removeItem('aiistore99_admin_token');
          setToken(null);
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Failed to verify admin token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login gagal' };
      }

      setToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem('aiistore99_admin_token', data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Koneksi ke server gagal' };
    }
  };

  const logout = () => {
    localStorage.removeItem('aiistore99_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (!token) return { success: false, error: 'Sesi belum terautentikasi' };
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Gagal mengubah password' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal mengubah password' };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token && !!adminUser,
        isLoading,
        login,
        logout,
        changePassword
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
