// RecipesPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import AddRecipeForm from '../components/recipes/AddRecipeForm';
import EditRecipeForm from '../components/recipes/EditRecipeForm';
import { Link } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes'; // Імпортуємо кастомний хук
// RecipesPage.jsx
import '../styles/styles.css'; // Імпортуємо стилі на початку файлу

const RecipesPage = () => {
  const { recipes, loading, error, fetchRecipes } = useRecipes(); // Використовуємо кастомний хук
  const [editRecipeId, setEditRecipeId] = useState(null);

  const handleEditClick = (recipeId) => {
    setEditRecipeId(recipeId);
  };

  const handleCancelEdit = () => {
    setEditRecipeId(null);
  };

  const handleRecipeAdded = (newRecipe) => {
    // Додаємо новий рецепт до локального стану
    fetchRecipes(); // Оновлюємо список рецептів
  };

  const handleRecipeUpdated = (updatedRecipe) => {
    // Оновлюємо рецепт у локальному стані
    fetchRecipes(); // Оновлюємо список рецептів
    setEditRecipeId(null);
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <h1>Список рецептів</h1>
      <AddRecipeForm onRecipeAdded={handleRecipeAdded} /> {/* Передаємо onRecipeAdded */}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            {editRecipeId === recipe.id ? (
              <EditRecipeForm
                recipeId={recipe.id}
                onRecipeUpdated={handleRecipeUpdated}
              />
            ) : (
              <div>
                <h2>{recipe.title}</h2>
                {recipe.photo && (
                  <img
                    src={`http://localhost:5000${recipe.photo}`} // Відображення фото з правильним шляхом
                    alt={recipe.title}
                    style={{ width: '300px', height: 'auto' }}
                  />
                )}
                <Link to={`/recipes/${recipe.id}`}>Більше</Link>
                <button onClick={() => handleEditClick(recipe.id)}>
                  Редагувати
                </button>
              </div>
            )}
            {editRecipeId === recipe.id && (
              <button onClick={handleCancelEdit}>Скасувати редагування</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipesPage;
