import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (data: string[]) => orderBurgerApi(data)
);
