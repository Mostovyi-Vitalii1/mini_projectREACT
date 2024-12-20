// src/App.jsx
import React from 'react';
import { AuthProvider } from './features/auth/context/AuthContext'; // Підключаємо контекст
import AppRoutes from './routes/AppRoutes'; // Підключаємо маршрути
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      {/* Внутрішні маршрути додатку */}
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
