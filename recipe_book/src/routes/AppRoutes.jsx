import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RecipesPage from '../pages/RecipesPage';
import RecipeDetailPage from '../pages/RecipeDetailPage'; // Імпорт сторінки деталей рецепту
import PrivateRoute from './PrivateRoute'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
        <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetailPage /></PrivateRoute>} /> {/* Маршрут для деталей рецепту */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
