import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export const loadIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);
