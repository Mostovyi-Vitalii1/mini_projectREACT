import React, { useContext, useState, useEffect } from 'react';
import AddRecipeForm from '../components/recipes/AddRecipeForm';
import EditRecipeForm from '../components/recipes/EditRecipeForm';
import { Link, useNavigate } from 'react-router-dom';
import useFetchRecipe from '../hooks/useFetchRecipe'; // Імпортуємо оновлений кастомний хук
import { AuthContext } from '../context/AuthContext';
import '../styles/styles.css';

const RecipesPage = () => {
  const { currentUser, logout } = useContext(AuthContext); // Отримуємо інформацію про користувача та метод logout
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [recipes, setRecipes] = useState([]); // Додаємо локальний стан для списку рецептів
  const navigate = useNavigate();

  // Використовуємо кастомний хук для отримання рецептів користувача
  const { loading, error } = useFetchRecipe(null, currentUser?.id);

  useEffect(() => {
    if (currentUser?.id) {
      // Завантажуємо рецепти при кожному змінюванні користувача
      const fetchRecipes = async () => {
        const response = await fetch(`http://localhost:5000/api/recipes/user/${currentUser.id}`);
        const data = await response.json();
        setRecipes(data); // Оновлюємо стан зі списком рецептів
      };
      fetchRecipes();
    }
  }, [currentUser?.id]);

  const handleEditClick = (recipeId) => {
    setEditRecipeId(recipeId);
  };

  const handleCancelEdit = () => {
    setEditRecipeId(null);
  };

  const handleRecipeAdded = (newRecipe) => {
    // Оновлюємо локальний стан, додаючи новий рецепт
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const handleRecipeUpdated = (updatedRecipe) => {
    // Оновлюємо локальний стан, замінюючи старий рецепт на оновлений
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    setEditRecipeId(null);
  };

  const handleLogout = () => {
    logout(); // Викликаємо метод logout з контексту для видалення користувача
    navigate('/'); // Перенаправляємо на сторінку логіну
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">Вихід</button>
      </div>

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
