// src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Підключаємо контекст
import AppRoutes from './routes/AppRoutes'; // Підключаємо маршрути

const App = () => {
  return (
    <AuthProvider>
      {/* Внутрішні маршрути додатку */}
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
