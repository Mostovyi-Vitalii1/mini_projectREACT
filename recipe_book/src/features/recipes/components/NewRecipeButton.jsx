// components/NewButton.jsx
import React from 'react';

const NewRecipeButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="open-panel-button">
      Створити новий рецепт
    </button>
  );
};

export default NewRecipeButton;
