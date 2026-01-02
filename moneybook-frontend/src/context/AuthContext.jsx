import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load token on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);

        // ⛔ Auto logout if expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
        } else {
          setToken(savedToken);
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.clear();
      }
    }

    setLoading(false);
  }, []);

  // 🔐 Login
  const login = (jwt) => {
    const decoded = jwtDecode(jwt);
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(decoded);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
