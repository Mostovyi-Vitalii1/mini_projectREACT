// components/RecipePanel.jsx
import React from 'react';
import AddRecipeForm from './AddRecipeForm';

const RecipePanel = ({ isPanelOpen, togglePanel, handleRecipeAdded }) => {
  if (!isPanelOpen) return null;

  return (
    <div className="recipe-panel">
      <button onClick={togglePanel} className="close-panel-button">
        Закрити
      </button>
      <AddRecipeForm onRecipeAdded={handleRecipeAdded} />
    </div>
  );
};

export default RecipePanel;
