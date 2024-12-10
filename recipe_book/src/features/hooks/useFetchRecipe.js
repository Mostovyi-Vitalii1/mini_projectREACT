import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRecipe = (userId) => {
  const [recipes, setRecipes] = useState([]); // Для зберігання рецептів
  const [categories, setCategories] = useState([]); // Для категорій
  const [status, setStatus] = useState({ loading: true, error: null }); // Стейт для завантаження і помилок

  useEffect(() => {
    const fetchCategories = async () => {
      setStatus((prevStatus) => ({ ...prevStatus, loading: true })); // Встановлюємо loading = true
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (err) {
        setStatus((prevStatus) => ({ ...prevStatus, error: 'Не вдалося завантажити категорії' }));
      } finally {
        setStatus((prevStatus) => ({ ...prevStatus, loading: false })); // Завершуємо завантаження
      }
    };

    const fetchRecipes = async () => {
      setStatus((prevStatus) => ({ ...prevStatus, loading: true }));
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/user/${userId}`);
        setRecipes(response.data);
      } catch (err) {
        setStatus((prevStatus) => ({ ...prevStatus, error: 'Помилка при завантаженні рецептів' }));
      } finally {
        setStatus((prevStatus) => ({ ...prevStatus, loading: false }));
      }
    };

    fetchCategories();
    if (userId) fetchRecipes();

  }, [userId]);

  return { recipes, categories, loading: status.loading, error: status.error };
};

export default useFetchRecipe;
