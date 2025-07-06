// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../Services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]   = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
          localStorage.setItem('token', token);
        }
      } catch {
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async ({ email, password }, redirectTo = '/admin/default') => {
    console.log('[AuthContext] login() got:', { email, password });
    const { token: jwt } = await signIn({ email, password });
    console.log('[AuthContext] received JWT:', jwt);
    setToken(jwt);
    navigate(redirectTo, { replace: true });
  };

  const logout = () => {
    setToken(null);
    navigate('/auth/sign-in', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
