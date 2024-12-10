import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../features/auth/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // Якщо користувач не залогінений, перенаправляємо на сторінку логіну
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;