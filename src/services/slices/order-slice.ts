import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from './../../utils/types';

import { sendOrder } from '../actions/send-order';

export interface TOrderState {
  data: string[];
  loading: boolean;
  error: Object;
}

const initialState: TOrderState = {
  data: [],
  loading: false,
  error: {}
};

const isActionRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isActionPending = (action: { type: string }) =>
  action.type.endsWith('pending');

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

      .addMatcher(isActionPending, (state) => {
        state.loading = true;
        state.error = '';
      })

      .addMatcher(isActionRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
  selectors: {
    getOrderCost: (state) => state.data.cost,
   
    getStatus: (state) => state.loading
  }
});

export const ingredientsActions = orderSlice.actions;
export const { getOrderCost, getStatus } = orderSlice.selectors;
