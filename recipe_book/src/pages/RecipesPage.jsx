import React, { useContext, useState } from 'react';
import AddRecipeForm from '../components/recipes/AddRecipeForm';
import EditRecipeForm from '../components/recipes/EditRecipeForm';
import { Link } from 'react-router-dom';
import useFetchRecipe from '../hooks/useFetchRecipe'; // Імпортуємо оновлений кастомний хук
import { AuthContext } from '../context/AuthContext';
import '../styles/styles.css';

const RecipesPage = () => {
  const { currentUser } = useContext(AuthContext); // Отримуємо інформацію про користувача
  const [editRecipeId, setEditRecipeId] = useState(null);

  // Використовуємо кастомний хук для отримання рецептів користувача
  const { recipes, loading, error } = useFetchRecipe(null, currentUser?.id);

  const handleEditClick = (recipeId) => {
    setEditRecipeId(recipeId);
  };

  const handleCancelEdit = () => {
    setEditRecipeId(null);
  };

  const handleRecipeAdded = (newRecipe) => {
    // Додаємо новий рецепт до локального стану
    // Необхідно буде оновити локальний стан рецептів
  };

  const handleRecipeUpdated = (updatedRecipe) => {
    // Оновлюємо рецепт у локальному стані
    // Необхідно буде оновити локальний стан рецептів
    setEditRecipeId(null);
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <h1>Список рецептів</h1>
      <AddRecipeForm onRecipeAdded={handleRecipeAdded} />
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
                    src={`http://localhost:5000${recipe.photo}`}
                    alt={recipe.title}
                    style={{ width: '300px', height: 'auto' }}
                  />
                )}
                <Link to={`/recipes/${recipe.id}`}>Більше</Link>
                <button onClick={() => handleEditClick(recipe.id)}>Редагувати</button>
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
