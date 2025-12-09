import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (data: string[], { rejectWithValue }) => {
    const res = await orderBurgerApi(data);
    if (!res?.success) {
      return rejectWithValue(data);
    }
    return res.order;
  }
);
