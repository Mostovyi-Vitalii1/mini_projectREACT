// RecipeDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGetAllToDo from '../../hooks/UseGetAllToDo';
import RecipeIngredients from './components/RecipeIngredients';
import RecipeInfo from './components/RecipeInfo';
import DeleteRecipeButton from './components/DeleteRecipeButton';
import '../../../styles/styles.css';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipe, loading, error } = useGetAllToDo(`http://localhost:5000/api/recipes/${id}`);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Не вдалося видалити рецепт');
      navigate('/');
    } catch (error) {
      console.error('Помилка при видаленні рецепта:', error.message);
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!recipe) return <p>Рецепт не знайдено</p>;

  // Перетворюємо ingredients у масив, якщо це рядок
  const ingredients = typeof recipe.ingredients === 'string' 
    ? JSON.parse(recipe.ingredients) 
    : recipe.ingredients;

  return (
    <div className="page-container">
      <div className="recipe-content">
        <RecipeInfo title={recipe.title} photo={recipe.photo} category={recipe.category} />
        <RecipeIngredients ingredients={ingredients} />
        
        <h3>Опис:</h3>
        <p style={{ textAlign: "center", color: 'white' }}>{recipe.description}</p>

        <DeleteRecipeButton handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default RecipeDetailPage;
