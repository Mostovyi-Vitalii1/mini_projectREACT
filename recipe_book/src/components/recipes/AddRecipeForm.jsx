import React, { useState } from 'react';
import axios from 'axios';

const AddRecipeForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

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
      formData.append('photo', photo); // Додаємо файл фото
      console.log('Завантажене фото:', photo);
    } else {
      console.error('Фото не було вибрано');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Рецепт успішно додано:', response.data);
      // Очистка полів форми після успішного додавання
      setTitle('');
      setCategory('');
      setIngredients(['']);
      setDescription('');
      setPhoto(null);
    } catch (error) {
      if (error.response) {
        // Сервер повернув відповідь з помилкою
        console.error('Помилка при додаванні рецепта:', error.response.data);
      } else {
        // Інші помилки
        console.error('Помилка:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Додати новий рецепт</h2>
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
      <button type="submit">Додати рецепт</button>
    </form>
  );
};

export default AddRecipeForm;
