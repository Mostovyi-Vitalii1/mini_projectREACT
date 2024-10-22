import { useState } from 'react';
import axios from 'axios';

export const useToDo = (url) => {
  const [error, setError] = useState(null);

  const addRecipe = async (newRecipe) => {
    try {
      const response = await axios.post(url, newRecipe);
      return response.data;
    } catch (err) {
      setError(err.message);
    }
  };

  const editRecipe = async (id, updatedRecipe) => {
    try {
      const response = await axios.put(`${url}/${id}`, updatedRecipe);
      return response.data;
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return { addRecipe, editRecipe, deleteRecipe, error };
};
