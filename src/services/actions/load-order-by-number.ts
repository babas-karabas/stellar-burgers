import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';

export const loadOrderByNumber = createAsyncThunk(
  'order/getIngredients',
  async (data: number) => getOrderByNumberApi(data)
);
