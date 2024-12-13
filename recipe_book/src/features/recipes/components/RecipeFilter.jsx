import React, { useState } from 'react';

const RecipeFilter = ({ onCategoryFilter, onSearch, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    onCategoryFilter(selectedCategory);
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchQuery(searchText);
    onSearch(searchText);
  };

  return (
    <div className="filter-panel">
      <h2>Фільтрація рецептів</h2>
      <div>
        <label htmlFor="category" style={{ color: '#FFFFFF' }}>Виберіть категорію:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">-- Виберіть категорію --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
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
