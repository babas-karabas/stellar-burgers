import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';

export const loadFeeds = createAsyncThunk('feeds/getFeeds', async () => {
  const { orders, total, totalToday } = await getFeedsApi();
  return { orders, total, totalToday };
});

export const loadOrders = createAsyncThunk('feeds/getOrders', getOrdersApi);

export const loadOrderByNumber = createAsyncThunk(
  'feeds/loadOrderByNumber',
  async (data: number) => {
    const res = await getOrderByNumberApi(data);
    return res.orders[0];
  }
);
