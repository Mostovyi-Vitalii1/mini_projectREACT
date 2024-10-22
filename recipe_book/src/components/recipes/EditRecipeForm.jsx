import React, { useState } from 'react';
import useFetchRecipe from '../../hooks/useFetchRecipe'; // Імпортуйте ваш новий хук
import axios from 'axios'; // Імпорт axios
const EditRecipeForm = ({ recipeId, onRecipeUpdated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  // Використання кастомного хука для завантаження рецепту
  const { recipe, loading, error } = useFetchRecipe(recipeId);

  // Перевірка, чи дані рецепту завантажено
  if (loading) return <p>Завантаження рецепту...</p>;
  if (error) return <p>{error}</p>;
  
  // Якщо рецепт завантажено, оновлюємо стан
  if (recipe && title === '' && category === '' && description === '') {
    setTitle(recipe.title);
    setCategory(recipe.category);
    setIngredients(Array.isArray(recipe.ingredients) ? recipe.ingredients : ['']);
    setDescription(recipe.description);
  }

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('description', description);

    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/recipes/${recipeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Рецепт успішно оновлено:', response.data);
      // Виклик функції зворотного виклику з новим рецептом
      if (onRecipeUpdated) onRecipeUpdated(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Помилка при оновленні рецепта:', error.response.data);
      } else {
        console.error('Помилка:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Редагувати рецепт</h2>
      <input
        type="text"
        placeholder="Назва страви"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Категорія"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      {ingredients.map((ingredient, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Інгредієнт ${index + 1}`}
          value={ingredient}
          onChange={(e) => handleIngredientChange(index, e.target.value)}
          required
        />
      ))}
      <button type="button" onClick={addIngredient}>
        Додати інгредієнт
      </button>
      <textarea
        placeholder="Опис приготування"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setPhoto(e.target.files[0])}
        accept="image/*"
      />
      <button type="submit">Оновити рецепт</button>
    </form>
  );
};

export default EditRecipeForm;
