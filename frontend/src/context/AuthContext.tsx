import React, { useState, useEffect, createContext, useContext } from "react";

type User = {
  // Define user properties here
  id: string;
  username: string;
  // Add other user properties as needed
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  verifyToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const verifyToken = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("/api/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData: User = await response.json();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (error) {
        console.error("Token verification error:", error);
        logout();
      }
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = (token: string): void => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    verifyToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
