'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, tokenManager } from '@/lib/api';

const UserContext = createContext({ user: null, loading: true, error: null });

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = tokenManager.get();
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await authApi.getProfile(token);
        setUser(res.user);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
