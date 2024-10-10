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
    console.log('in verifytoken, localstorage is ', localStorage);
    const token = localStorage.getItem("token");
    if (token) {
      console.log('token detected in localstorage, verifying it in backend now...')
      try {
        const response = await fetch("http://localhost:3001/auth/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          console.log('token authenticated. ur now authenticated')
          const userData: User = await response.json();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          console.log('token NOT authenticaed. ur logged out now')
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
    console.log('refreshed page. calling verifytoken...')
    verifyToken();
  }, []);

  const login = (token: string): void => {
    console.log('login called.  token stored to localstorage')
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
