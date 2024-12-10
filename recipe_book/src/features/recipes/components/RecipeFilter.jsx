import React, { useState, useEffect } from 'react';

const RecipeFilter = ({ onCategoryFilter, onSearch }) => {
  const [categories, setCategories] = useState([]); // Для збереження категорій
  const [selectedCategory, setSelectedCategory] = useState(''); // Для збереження вибраної категорії
  const [searchQuery, setSearchQuery] = useState(''); // Для збереження запиту пошуку за назвою

  useEffect(() => {
    // Завантажуємо категорії при першому завантаженні компонента
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories'); // Запит на сервер для отримання категорій
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Не вдалося завантажити категорії122131', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    onCategoryFilter(selectedCategory); // Викликаємо фільтрацію за категорією
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchQuery(searchText);
    onSearch(searchText); // Викликаємо пошук за назвою
  };

  return (
    <div className="filter-panel">
      <h2>Фільтрація рецептів</h2>
      
      {/* Фільтрація за категорією */}
      <div>
        <label  htmlFor="category" style={{ color: '#FFFFFF' }}>Виберіть категорію:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">-- Виберіть категорію --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Пошук за назвою */}
      <div>
        <label htmlFor="search" style={{ color: '#FFFFFF' }}>Пошук за назвою:</label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Введіть назву рецепта"
        />
      </div>
    </div>
  );
};

export default RecipeFilter;
