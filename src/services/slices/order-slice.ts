import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from './../../utils/types';
import { sendOrder } from '../actions/send-order';

export interface TOrderState {
  data: TOrder | null;
  name: string;
  loading: boolean;
  error: Object;
}

const initialState: TOrderState = {
  data: null,
  name: '',
  loading: false,
  error: {}
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.data = action.payload.order;
        state.name = action.payload.name;
        state.loading = false;
      })

      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })

      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Unknown error';
      });
  },
  selectors: {
    getNewOrder: (state) => state.data,
    getNewOrderName: (state) => state.name,
    getStatus: (state) => state.loading
  }
});

export const newOrderActions = orderSlice.actions;
export const { getNewOrderName, getStatus, getNewOrder } = orderSlice.selectors;
