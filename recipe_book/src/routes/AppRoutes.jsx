import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RecipesPage from '../pages/RecipesPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import { AuthContext } from '../context/AuthContext'; // Імпортуємо контекст для перевірки автентифікації
import PrivateRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { currentUser } = useContext(AuthContext); // Перевірка, чи є користувач залогінений

  return (
    <Router>
      <Routes>
        {/* Якщо користувач не залогінений, показуємо сторінку логіну */}
        <Route
          path="/"
          element={currentUser ? <RecipesPage /> : <LoginPage />}
        />
        
        {/* Сторінка з рецептами, доступна лише для залогінених користувачів */}
        <Route
          path="/recipes"
          element={
            <PrivateRoute>
              <RecipesPage />
            </PrivateRoute>
          }
        />
        
        {/* Сторінка деталей рецепту, доступна лише для залогінених користувачів */}
        <Route
          path="/recipes/:id"
          element={
            <PrivateRoute>
              <RecipeDetailPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
