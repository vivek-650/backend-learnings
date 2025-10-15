"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loginUser as apiLogin,
  logoutUser as apiLogout,
  getCurrentUser,
} from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize checkAuth function
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed

  // Check if user is logged in on mount - only once
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  async function login(credentials) {
    try {
      setError(null);
      const response = await apiLogin(credentials);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function logout() {
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear user on client side even if API call fails
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
