"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User { username: string; email: string; token: string; }
interface AuthCtx { user: User | null; login: (token: string, username: string, email: string) => void; logout: () => void; }

const AuthContext = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token    = localStorage.getItem("sp_token");
    const username = localStorage.getItem("sp_username");
    const email    = localStorage.getItem("sp_email");
    if (token && username && email) setUser({ token, username, email });
  }, []);

  const login = (token: string, username: string, email: string) => {
    localStorage.setItem("sp_token",    token);
    localStorage.setItem("sp_username", username);
    localStorage.setItem("sp_email",    email);
    setUser({ token, username, email });
  };

  const logout = () => {
    localStorage.removeItem("sp_token");
    localStorage.removeItem("sp_username");
    localStorage.removeItem("sp_email");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
