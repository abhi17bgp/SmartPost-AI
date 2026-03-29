import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user on load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const userData = res.data.data.user;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (credentials) => {
    return await api.post('/auth/register', credentials);
  };

  const logout = async () => {
    try {
      await toast.promise(
        api.post('/auth/logout'),
        {
          loading: 'Logging out...',
          success: 'Successfully logged out!',
          error: 'Error logging out'
        }
      );
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    const res = await api.patch('/auth/updateMe', data);
    const updatedUser = res.data.data.user;
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
