// components/RecipeCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, onEditClick }) => {
  return (
    <div className="recipe-card">
      <h5>{recipe.title}</h5>
      {recipe.photo && (
        <img
          src={`http://localhost:5000${recipe.photo}`}
          alt={recipe.title}
          style={{ width: '300px', height: 'auto' }}
        />
      )}
      <Link to={`/recipes/${recipe.id}`}>Більше</Link>
      <button onClick={() => onEditClick(recipe.id)}>Редагувати</button>
    </div>
  );
};

export default RecipeCard;
