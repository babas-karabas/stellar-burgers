import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

export const loadIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);
