// components/RecipeList.jsx
import React from 'react';
import RecipeCard from './RecipeCard';
import EditRecipeForm from './EditRecipeForm';

const RecipeList = ({ filteredRecipes, editRecipeId, handleEditClick, handleRecipeUpdated, handleCancelEdit }) => {
  return (
    <ul>
      {filteredRecipes.map((recipe) => (
        <li key={recipe.id}>
          {editRecipeId === recipe.id ? (
            <EditRecipeForm
              recipeId={recipe.id}
              onRecipeUpdated={handleRecipeUpdated}
            />
          ) : (
            <RecipeCard recipe={recipe} onEditClick={handleEditClick} />
          )}
          {editRecipeId === recipe.id && (
            <button onClick={handleCancelEdit}>Скасувати редагування</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
