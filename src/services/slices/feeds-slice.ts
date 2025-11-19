import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from './../../utils/types';

import {
  loadFeeds,
  loadOrders,
  loadOrderByNumber
} from '../actions/load-feeds';

export interface TFeedsState {
  feeds: TOrdersData;
  loading: boolean;
  error: string | null;
  userOrders: TOrder[];
  orderForModal: TOrder | null;
}

const initialState: TFeedsState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null,
  userOrders: [],
  orderForModal: null
};

const isActionRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isActionPending = (action: { type: string }) =>
  action.type.endsWith('pending');

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearOrderByNumber: (state) => {
      state.orderForModal = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loadFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.feeds = action.payload;
        }
      )
      .addCase(
        loadOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrders = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        loadOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.orderForModal = action.payload;
        }
      )
      .addMatcher(isActionPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isActionRejected, (state, action) => {
        state.loading = false;
        state.error = `Error of ${action.type}`;
      });
  },
  selectors: {
    getFeeds: (state) => state.feeds.orders,
    getTotal: (state) => state.feeds.total,
    getTotalToday: (state) => state.feeds.totalToday,
    getStatus: (state) => state.loading,
    getOrders: (state) => state.userOrders,
    getOrderByNumber: (state) => state.orderForModal
  }
});

export const { clearOrderByNumber } = feedsSlice.actions;
export const {
  getFeeds,
  getStatus,
  getTotal,
  getTotalToday,
  getOrders,
  getOrderByNumber
} = feedsSlice.selectors;
