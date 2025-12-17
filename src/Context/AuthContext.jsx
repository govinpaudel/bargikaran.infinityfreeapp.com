import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize

      const lastLoginDate = new Date(parsedUser.last_login);
      lastLoginDate.setHours(0, 0, 0, 0);

      const expireDate = new Date(parsedUser.expire_at);
      expireDate.setHours(0, 0, 0, 0);

      // ❌ Last login expired (today > last_login)
      if (today > lastLoginDate) {
        logout();
        setLoading(false);
        return;
      }

      // ❌ Account expired
      if (today > expireDate) {
        logout();
        setLoading(false);
        return;
      }

      // ✅ Valid user
      setUser(parsedUser);
    } catch (err) {
      console.error("Invalid session user", err);
      logout();
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
