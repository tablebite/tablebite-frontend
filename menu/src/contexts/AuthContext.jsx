import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { generateToken, generateRefreshToken } from '../Services/allApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000; // Expiry time in milliseconds
        const currentTime = Date.now();

        if (expiryTime > currentTime) {
          setUser(decoded);
          localStorage.setItem('token', token);
          localStorage.setItem('expiresAt', expiryTime); // Store expiry time
        } else {
          console.log('[AuthContext] Token expired, will refresh on action.');
          refreshToken();  // Attempt to refresh the token if expired
        }
      } catch (error) {
        console.error('[AuthContext] Error decoding token:', error);
        logout(); // Token is invalid, logout
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
    }
  }, [token]);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username'); // Username for refreshing the token
    const refreshTokenExpiry = parseInt(localStorage.getItem('refreshTokenExpiresAt'), 10); // Get refresh token expiry

    if (refreshToken && username) {
      if (refreshTokenExpiry && refreshTokenExpiry < Date.now()) {
        console.error('[AuthContext] Refresh token expired, logging out');
        logout(); // Clear session if refresh token has expired
        return;
      }

      console.log('[AuthContext] Refreshing token using refresh token:', refreshToken);

      const { status, data } = await generateRefreshToken({ username, refreshToken });

      if (status === 201 && data.accessToken) {
        const { accessToken, refreshToken: newRefreshToken, expiresIn } = data;

        // Calculate the new expiration timestamp
        const expiryTime = Date.now() + expiresIn;

        console.log('[AuthContext] New token expiry time (ms):', expiryTime);
        const expiryDate = new Date(expiryTime);
        console.log('[AuthContext] New token expiry time (Date):', expiryDate.toString());

        // Store new token and expiry in localStorage
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('expiresAt', expiryTime); // Update expiry time
        localStorage.setItem('refreshToken', newRefreshToken); // Update refresh token
        localStorage.setItem('username', username); // Ensure username is stored for future refresh
        localStorage.setItem('refreshTokenExpiresAt', expiryTime); // Store refresh token expiry time

        // Decode new JWT to get user data
        const decodedUser = jwtDecode(accessToken);
        setUser(decodedUser);

        console.log('[AuthContext] Received new JWT:', accessToken);
      } else {
        console.error('[AuthContext] Refresh token failed');
        logout();
      }
    } else {
      console.error('[AuthContext] No refresh token or username found');
      logout();
    }
  };

  const login = async ({ username, password }, redirectTo = '/admin/default') => {
    console.log('[AuthContext] login() got:', { username, password });

    const { status, data } = await generateToken({ username, password });

    if (status === 201 && data.accessToken) {
      const { accessToken, refreshToken, expiresIn } = data;

      const expiryTime = Date.now() + expiresIn;
      console.log('[AuthContext] Token expiry time (ms):', expiryTime);
      const expiryDate = new Date(expiryTime);
      console.log('[AuthContext] Token expiry time (Date):', expiryDate.toString());

      // Store tokens and expiry time in localStorage
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('expiresAt', expiryTime);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username); // Store username for refresh flow

      // Store refresh token expiry time
      localStorage.setItem('refreshTokenExpiresAt', expiryTime); 

      // Decode JWT to extract user data
      const decodedUser = jwtDecode(accessToken);
      setUser(decodedUser);

      console.log('[AuthContext] received JWT:', accessToken);
      navigate(redirectTo, { replace: true });
    } else {
      console.error('[AuthContext] Login failed, no access token returned');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiresAt'); // Clear refresh token expiry time
    localStorage.removeItem('username');
    navigate('/auth/sign-in', { replace: true });
  };

  const isTokenExpired = () => {
    const expiresAt = parseInt(localStorage.getItem('expiresAt'), 10);
    return expiresAt && Date.now() > expiresAt;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isTokenExpired, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
