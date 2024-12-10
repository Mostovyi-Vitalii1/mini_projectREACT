// components/DeleteRecipeButton.jsx
import React from 'react';

const DeleteRecipeButton = ({ handleDelete }) => {
  return (
    <button onClick={handleDelete}>Видалити рецепт</button>
  );
};

export default DeleteRecipeButton;
