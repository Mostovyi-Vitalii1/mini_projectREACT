import React, { createContext, useState, useEffect } from 'react';

// Створення контексту для автентифікації
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Перевірка, чи є дані користувача в localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser)); // Встановлюємо користувача, якщо є
    }
  }, []);

  const login = (user) => {
    // Збереження даних користувача в localStorage при логіні
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    // Видалення користувача з localStorage при логауті
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
