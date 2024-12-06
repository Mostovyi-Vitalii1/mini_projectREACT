// useFetchRecipe.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRecipe = (recipeId, userId) => {
  const [recipe, setRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]); // Додано для зберігання рецептів користувача
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Не вдалося завантажити категорії:', err);
      }
    };
    fetchCategories();
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        if (recipeId) {
          const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
          const fetchedRecipe = response.data;

          // Перевіряємо та конвертуємо ingredients у масив, якщо це рядок
          fetchedRecipe.ingredients = typeof fetchedRecipe.ingredients === 'string' 
            ? JSON.parse(fetchedRecipe.ingredients) 
            : fetchedRecipe.ingredients;

          setRecipe(fetchedRecipe);
        } else if (userId) { // Якщо userId передано, отримуємо рецепти користувача
          const response = await axios.get(`http://localhost:5000/api/recipes/user/${userId}`);
          const userRecipes = response.data;
          setRecipes(userRecipes);
        }
      } catch (error) {
        setError('Помилка при завантаженні даних');
      } finally {
        setLoading(false);
      }
    };

    // Виконувати запит тільки якщо хоча б один з параметрів не є null
    if (recipeId || userId) {
      fetchRecipe();
    }
  }, [recipeId, userId]); // Додаємо userId до залежностей

  return { recipe, recipes, loading, error }; // Повертаємо рецепти також
};

export default useFetchRecipe;
