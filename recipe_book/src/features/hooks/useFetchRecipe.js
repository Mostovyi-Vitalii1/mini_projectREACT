import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRecipe = (recipeId, userId) => {
  const [recipe, setRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]); // Додано для зберігання рецептів користувача
  const [categories, setCategories] = useState([]); // Додано для зберігання категорій
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функція для отримання категорій
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/categories');
    setCategories(response.data);
  } catch (err) {
    console.error('Не вдалося завантажити категорії:', err);
    setError('Не вдалося завантажити категорії');
  } finally {
    setLoading(false); // Завжди вимикаємо loading, навіть якщо була помилка
  }
};


    // Функція для отримання рецепта або рецептів користувача
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        if (recipeId) {
          const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
          const fetchedRecipe = response.data;

          // Перевірка та конвертація ingredients у масив, якщо це рядок
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

    // Завантажуємо категорії лише один раз
    fetchCategories(); 

    // Завантажуємо рецепти або один рецепт
    if (recipeId || userId) {
      fetchRecipe(); 
    }
  }, [recipeId, userId]); // Викликається при зміні recipeId або userId

  return { recipe, recipes, categories, loading, error }; // Повертаємо категорії разом з рецептами
};

export default useFetchRecipe;
