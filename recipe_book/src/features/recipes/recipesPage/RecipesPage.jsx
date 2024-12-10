// RecipesPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchRecipe from '../../hooks/useFetchRecipe';
import { AuthContext } from '../../auth/context/AuthContext';
import RecipeFilter from '../components/RecipeFilter';
import RecipeList from '../components/RecipeList'; // Новий компонент
import RecipePanel from '../components/RecipePanel'; // Новий компонент
import NewButton from '../components/NewRecipeButton';
import '../../../styles/styles.css';

const RecipesPage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [recipes, setRecipes] = useState([]); // Список всіх рецептів
  const [filter, setFilter] = useState({ category: '', searchQuery: '' }); // Фільтр категорії та пошуку
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

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
          <NewButton onClick={togglePanel} />

          {/* Панель для створення рецепта */}
          <RecipePanel isPanelOpen={isPanelOpen} togglePanel={togglePanel} handleRecipeAdded={handleRecipeAdded} />

          {/* Список рецептів */}
          <RecipeList
            filteredRecipes={filteredRecipes}
            editRecipeId={editRecipeId}
            handleEditClick={handleEditClick}
            handleRecipeUpdated={handleRecipeUpdated}
            handleCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
