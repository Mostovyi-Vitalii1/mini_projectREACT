import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGetAllToDo from '../hooks/UseGetAllToDo';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipe, loading, error } = useGetAllToDo(`http://192.168.0.109:5000/api/recipes/${id}`);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://192.168.0.109:5000/api/recipes/${id}`, {
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
    <div>
      <h1>{recipe.title}</h1>
      {recipe.photo && (
        <img
          src={`http://192.168.0.109:5000${recipe.photo}`}
          alt={recipe.title}
          style={{ width: '300px', height: 'auto' }}
        />
      )}
      <h2>Категорія: {recipe.category}</h2>
      <h3>Інгредієнти:</h3>
      <ul>
        {Array.isArray(ingredients) && ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.quantity} {ingredient.unit}
            </li>
          ))
        ) : (
          <li>Інгредієнти недоступні</li>
        )}
      </ul>
      
      <h3>Опис:</h3>
      <p>{recipe.description}</p>
      
      <button onClick={handleDelete}>Видалити рецепт</button>
    </div>
  );
};

export default RecipeDetailPage;
