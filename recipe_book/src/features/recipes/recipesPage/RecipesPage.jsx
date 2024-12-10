import React, { useContext, useState, useEffect } from 'react';
import AddRecipeForm from '../components/AddRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';
import { Link } from 'react-router-dom';
import useFetchRecipe from '../../hooks/useFetchRecipe';
import { AuthContext } from '../../auth/context/AuthContext';
import RecipeFilter from '../components/RecipeFilter';
import '../../../styles/styles.css';

const RecipesPage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [recipes, setRecipes] = useState([]); // Список всіх рецептів
  const [filter, setFilter] = useState({ category: '', searchQuery: '' }); // Фільтр категорії та пошуку
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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

  const handleCategoryFilter = (selectedCategory) => {
    setFilter((prevFilter) => ({ ...prevFilter, category: selectedCategory }));
  };

  const handleSearch = (searchQuery) => {
    setFilter((prevFilter) => ({ ...prevFilter, searchQuery }));
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      !filter.category || recipe.category === filter.category;
    const matchesSearch =
      !filter.searchQuery ||
      recipe.title.toLowerCase().includes(filter.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div className="recipes-page">
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Вихід
        </button>
      </div>

      <div className="content">
        {/* Панель фільтрації */}
        <div className="filter-panel-container">
          <RecipeFilter onCategoryFilter={handleCategoryFilter} onSearch={handleSearch} />
        </div>

        <div className="recipes-container">
          <h1>Список рецептів</h1>

          {/* Кнопка для відкриття панелі */}
          <button onClick={togglePanel} className="open-panel-button">
            Створити новий рецепт
          </button>

          {/* Панель для створення рецепта */}
          {isPanelOpen && (
            <div className="recipe-panel">
              <button onClick={togglePanel} className="close-panel-button">
                Закрити
              </button>
              <AddRecipeForm onRecipeAdded={handleRecipeAdded} />
            </div>
          )}

          <ul>
            {filteredRecipes.map((recipe) => (
              <li key={recipe.id}>
                {editRecipeId === recipe.id ? (
                  <EditRecipeForm
                    recipeId={recipe.id}
                    onRecipeUpdated={handleRecipeUpdated}
                  />
                ) : (
                  <div className="recipe-card">
                    <h5>{recipe.title}</h5>
                    {recipe.photo && (
                      <img
                        src={`http://localhost:5000${recipe.photo}`}
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
      </div>
    </div>
  );
};

export default RecipesPage;
