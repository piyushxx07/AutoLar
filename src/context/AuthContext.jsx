import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('autolar-demo-user') || 'null'); }
    catch { return null; }
  });
  const loading = false;
  const authenticate = async (_path, credentials) => {
    const email = String(credentials.email || '').trim();
    const user = {
      name: String(credentials.name || email.split('@')[0] || 'Demo User').trim(),
      email,
      demo: true,
    };
    // This screen is a demo gate only; never call /auth or store/send a token.
    localStorage.removeItem('autolar-token');
    localStorage.setItem('autolar-demo-user', JSON.stringify(user));
    setUser(user);
    return user;
  };
  const logout = () => { localStorage.removeItem('autolar-demo-user'); localStorage.removeItem('autolar-token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
