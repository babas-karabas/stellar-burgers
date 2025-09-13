import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

export const sendOrder = createAsyncThunk(
  'ingredients/getIngredients',
  async (data: string[]) => orderBurgerApi(data)
);
