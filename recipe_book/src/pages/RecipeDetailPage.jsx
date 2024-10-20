import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Для перенаправлення після видалення
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Якщо ingredients приходить як рядок, перетворюємо його у масив
        data.ingredients = JSON.parse(data.ingredients);
        setRecipe(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Функція для видалення рецепту
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Не вдалося видалити рецепт');
      navigate('/'); // Після успішного видалення перенаправити на головну сторінку
    } catch (error) {
      console.error('Помилка при видаленні рецепта:', error.message);
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!recipe) return <p>Рецепт не знайдено</p>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      {recipe.photo && (
        <img
          src={`http://localhost:5000${recipe.photo}`} // Відображення фото з правильним шляхом
          alt={recipe.title}
          style={{ width: '300px', height: 'auto' }}
        />
      )}
      <h2>Категорія: {recipe.category}</h2>
      <h3>Інгредієнти:</h3>
      <ul>
        {Array.isArray(recipe.ingredients) ? (
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))
        ) : (
          <li>Інгредієнти недоступні</li>
        )}
      </ul>
      
      <h3>Опис:</h3>
      <p>{recipe.description}</p>
      
      {/* Кнопка для видалення */}
      <button onClick={handleDelete}>Видалити рецепт</button>
    </div>
  );
};

export default RecipeDetailPage;
