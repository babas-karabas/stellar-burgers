import { createSlice, isAction, PayloadAction, Slice } from '@reduxjs/toolkit';
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

const isRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isPending = (action: { type: string }) => action.type.endsWith('pending');

const hasPrefix = (action: { type: string }, prefix: string) =>
  action.type.startsWith(prefix);

const isPendingAction = (prefix: string) => (action: { type: string }) =>
  hasPrefix(action, prefix) && isPending(action);

const isRejectedAction = (prefix: string) => (action: { type: string }) =>
  hasPrefix(action, prefix) && isRejected(action);

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
      .addMatcher(isPendingAction('feeds'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejectedAction('feeds'), (state, action) => {
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
