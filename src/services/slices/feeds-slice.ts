import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from './../../utils/types';

import { loadFeeds } from '../actions/load-feeds';

export interface TFeedsState {
  data: TOrdersData;
  loading: boolean;
  error: string;
}

const initialState: TFeedsState = {
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: ''
};

const isActionRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isActionPending = (action: { type: string }) =>
  action.type.endsWith('pending');

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeeds.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

      .addMatcher(isActionPending, (state) => {
        state.loading = true;
        state.error = '';
      })

      .addMatcher(isActionRejected, (state, action) => {
        state.loading = false;
        state.error = 'Unknown error';
      });
  },
  selectors: {
    getFeeds: (state) => state.data.orders,
    getTotal: (state) => state.data.total,
    getTotalToday: (state) => state.data.totalToday,
    getStatus: (state) => state.loading
  }
});

export const feedsActions = feedsSlice.actions;
export const { getFeeds, getStatus, getTotal, getTotalToday } =
  feedsSlice.selectors;
