// useRecipes.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(response.data);
    } catch (err) {
      setError('Помилка при завантаженні рецептів');
    } finally {
      setLoading(false);
    }
  };

  // Викликаємо fetchRecipes при першому завантаженні
  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, loading, error, fetchRecipes };
};

export default useRecipes; // Не забудьте про експорт за замовчуванням
