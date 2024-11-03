// useFetchRecipe.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRecipe = (recipeId) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
        const fetchedRecipe = response.data;
        
        // Перевіряємо та конвертуємо ingredients у масив, якщо це рядок
        fetchedRecipe.ingredients = typeof fetchedRecipe.ingredients === 'string' 
          ? JSON.parse(fetchedRecipe.ingredients) 
          : fetchedRecipe.ingredients;

        setRecipe(fetchedRecipe);
      } catch (error) {
        setError('Помилка при завантаженні рецепту');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  return { recipe, loading, error };
};

export default useFetchRecipe;
