import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Завантажуємо дані про користувача з localStorage
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user)); // Зберігаємо користувача в localStorage
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user"); // Видаляємо користувача з localStorage
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
