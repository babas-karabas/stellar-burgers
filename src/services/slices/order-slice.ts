import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from './../../utils/types';
import { sendOrder } from '../actions/send-order';

export interface TOrderState {
  data: TOrder | null;
  loading: boolean;
  error: string | undefined;
}

const initialState: TOrderState = {
  data: null,
  loading: false,
  error: undefined
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderConstructor: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    getNewOrder: (state) => state.data,
    getNewOrderName: (state) => state.data?.name,
    getStatus: (state) => state.loading
  }
});

export const { getNewOrderName, getStatus, getNewOrder } = orderSlice.selectors;
export const { clearOrderConstructor } = orderSlice.actions;
