import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ваш контекст для автентифікації
import LoginPage from "../pages/LoginPage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetailPage from "../pages/RecipeDetailPage";

const AppRoutes = () => {
  const { currentUser } = useContext(AuthContext); // Перевірка чи є користувач залогінений

  return (
    <Router>
      <Routes>
        {/* Якщо користувач залогінений, не показуємо сторінку логіну, а перенаправляємо на головну */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/" /> : <LoginPage />} 
        />

        {/* Головний маршрут, доступний тільки для залогінених користувачів */}
        <Route
          path="/"
          element={currentUser ? <RecipesPage /> : <Navigate to="/login" />}
        />

        {/* Захищені маршрути для рецептів */}
        <Route
          path="/recipes"
          element={currentUser ? <RecipesPage /> : <Navigate to="/login" />}
        />
        
        {/* Захищений маршрут для деталей рецепту */}
        <Route
          path="/recipes/:id"
          element={currentUser ? <RecipeDetailPage /> : <Navigate to="/login" />}
        />

        {/* Якщо маршрут не знайдений */}
        <Route path="*" element={<div>404 - Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
