import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AddRecipeForm = ({ onRecipeAdded }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const { currentUser } = useContext(AuthContext); // Отримуємо інформацію про користувача з контексту

  const categories = [
    { id: 1, name: 'Десерти' },
    { id: 2, name: 'Напої' },
    { id: 3, name: 'Основні страви' },
    { id: 4, name: 'Салати' },
    { id: 5, name: 'Десерти' },
    { id: 6, name: 'Алкогольні напої' }
  ];

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.id) {
      console.error('Користувач не аутентифікований або відсутній ID користувача');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('description', description);
    formData.append('userId', currentUser.id); // Передаємо userId

    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Рецепт успішно додано:', response.data);

      // Скидаємо форму
      setTitle('');
      setCategory('');
      setIngredients([{ name: '', quantity: '', unit: '' }]);
      setDescription('');
      setPhoto(null);

      if (onRecipeAdded) onRecipeAdded(response.data);
    } catch (error) {
      console.error('Помилка при додаванні рецепта:', error.response ? error.response.data : error.message);
    }
  };

  if (!currentUser) {
    return <p>Завантаження даних користувача...</p>;
  }

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
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Оберіть категорію</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Інгредієнт ${index + 1}`}
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Кількість"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            required
          />
          <select
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            required
          >
            <option value="">Оберіть одиницю</option>
            <option value="грам">Грам</option>
            <option value="кг">Кілограм</option>
            <option value="шт">Шт</option>
            <option value="літр">Літр</option>
            <option value="мл">Мілілітр</option>
          </select>
          <button type="button" onClick={() => removeIngredient(index)}>
            Видалити інгредієнт
          </button>
        </div>
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
