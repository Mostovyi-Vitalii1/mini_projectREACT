import React, { useContext, useState, useEffect } from 'react';
import AddRecipeForm from '../components/recipes/AddRecipeForm';
import EditRecipeForm from '../components/recipes/EditRecipeForm';
import { Link } from 'react-router-dom';
import useFetchRecipe from '../hooks/useFetchRecipe';
import { AuthContext } from '../context/AuthContext';
import '../styles/styles.css';

const RecipesPage = () => {
const { currentUser, logout } = useContext(AuthContext); 
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  
  // Якщо currentUser ще не завантажений, показуємо лоадер
  if (currentUser === null) {
    return <p>Завантаження...</p>;
  }

  const { loading, error } = useFetchRecipe(null, currentUser?.id);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchRecipes = async () => {
        const response = await fetch(`http://localhost:5000/api/recipes/user/${currentUser.id}`);
        const data = await response.json();
        setRecipes(data);
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
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const handleRecipeUpdated = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    setEditRecipeId(null);
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
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
