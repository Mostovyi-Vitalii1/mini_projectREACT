// components/RecipeIngredients.jsx
import React from 'react';

const RecipeIngredients = ({ ingredients }) => {
  return (
    <div>
      <h3>Інгредієнти:</h3>
      <ul>
        {Array.isArray(ingredients) && ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.quantity} {ingredient.unit}
            </li>
          ))
        ) : (
          <li>Інгредієнти недоступні</li>
        )}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
