import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expireDate = new Date(parsedUser.expire_at);
      expireDate.setHours(0, 0, 0, 0);

      // ❌ Account expired
      if (today > expireDate) {
        logout();
        setLoading(false);
        return;
      }

      // ✅ User valid
      setUser(parsedUser);
    } catch (err) {
      console.error("Invalid stored user", err);
      logout();
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
