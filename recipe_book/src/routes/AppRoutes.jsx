import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ваш контекст для автентифікації
import LoginPage from "../pages/LoginPage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";
import ProtectedRoute from "./ProtectedRoute"; // Імпортуємо компонент ProtectedRoute

const AppRoutes = () => {
  const { currentUser } = useContext(AuthContext); // Перевірка чи є користувач залогіненим

  return (
    <Router>
      <Routes>
        {/* Сторінка логіну */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/" /> : <LoginPage />} 
        />

        {/* Захищені маршрути */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recipes" 
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recipes/:id" 
          element={
            <ProtectedRoute>
              <RecipeDetailPage />
            </ProtectedRoute>
          } 
        />

        {/* Сторінка для невідомих маршрутів */}
        <Route path="*" element={<div>404 - Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
