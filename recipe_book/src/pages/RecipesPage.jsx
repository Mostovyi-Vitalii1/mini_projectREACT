import React from 'react';
import { useGetAllToDo } from '../hooks/UseGetAllToDo';
import AddRecipeForm from '../components/recipes/AddRecipeForm';
import { Link } from 'react-router-dom'; // Імпортуємо Link для переходу до деталей рецепту

const RecipesPage = () => {
  const { data, loading, error } = useGetAllToDo('http://localhost:5000/api/recipes');

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <h1>Список рецептів</h1>
      <AddRecipeForm />
      <ul>
        {data.map((recipe) => (
          <li key={recipe.id}> {/* Переконайтеся, що recipe.id унікальний */}
            <h2>{recipe.title}</h2>
              {data.photo && <img src={data.photo} alt={data.title} style={{ width: '300px', height: 'auto' }} />} {/* Відображаємо фото */}
            <Link to={`/recipes/${recipe.id}`}>Більше</Link> {/* Кнопка для переходу до деталей рецепту */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipesPage;
