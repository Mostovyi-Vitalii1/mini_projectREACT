import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import RecipeFilter from '../components/RecipeFilter';
import RecipeList from '../components/RecipeList';
import RecipePanel from '../components/RecipePanel';
import NewButton from '../components/NewRecipeButton';
import useFetchRecipe from '../../hooks/useFetchRecipe';
import '../../../styles/styles.css';

const RecipesPage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [filter, setFilter] = useState({ category: '', searchQuery: '' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  // Викликаємо хук для отримання рецептів і категорій
  const { recipes, categories, loading, error, setRecipes } = useFetchRecipe(currentUser?.id);

  const handleRecipeAdded = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const handleRecipeUpdated = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = !filter.category || recipe.category === filter.category;
    const matchesSearch = !filter.searchQuery || recipe.title.toLowerCase().includes(filter.searchQuery.toLowerCase());
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
        <div className="filter-panel-container">
          <RecipeFilter 
            onCategoryFilter={handleCategoryFilter} 
            onSearch={handleSearch} 
            categories={categories} 
          />
        </div>

        <div className="recipes-container">
          <h1>Список рецептів</h1>
          <NewButton onClick={togglePanel} />
          <RecipePanel
            isPanelOpen={isPanelOpen}
            togglePanel={togglePanel}
            handleRecipeAdded={handleRecipeAdded}
            handleRecipeUpdated={handleRecipeUpdated}
          />
          {recipes.length === 0 ? (
            <p style={{ color: '#FFFFFF' }}>
              Рецептів не додано, додайте якийсь рецепт
            </p>
          ) : filteredRecipes.length === 0 ? (
            <p style={{ color: '#FFFFFF' }}>
              Немає рецептів за вашими фільтрами, додайте рецепт з такими параметрами
            </p>
          ) : (
            <RecipeList
              filteredRecipes={filteredRecipes}
              editRecipeId={editRecipeId}
              handleRecipeUpdated={handleRecipeUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
