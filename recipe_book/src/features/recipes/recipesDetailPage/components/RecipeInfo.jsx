// components/RecipeInfo.jsx
import React from 'react';

const RecipeInfo = ({ title, photo, category }) => {
  return (
    <div className="recipe-info">
      <h1>{title}</h1>
      {photo && <img src={`http://localhost:5000${photo}`} alt={title} />}
      <h2>Категорія: {category}</h2>
    </div>
  );
};

export default RecipeInfo;
