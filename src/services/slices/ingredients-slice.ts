import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from './../../utils/types';

import { loadIngredients } from '../actions/load-ingredients';

export interface TIngredientsState {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: TIngredientsState = {
  data: [],
  loading: false,
  error: null
};

const isActionRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isActionPending = (action: { type: string }) =>
  action.type.endsWith('pending');

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

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
    getIngredients: (state) => state.data,
    getBuns: (state) =>
      state.data.filter((ingredient) => ingredient.type === 'bun'),
    getSauces: (state) =>
      state.data.filter((ingredient) => ingredient.type === 'sauce'),
    getMains: (state) =>
      state.data.filter((ingredient) => ingredient.type === 'main'),
    getStatus: (state) => state.loading
  }
});

export const ingredientsActions = ingredientsSlice.actions;
export const { getIngredients, getStatus, getBuns, getSauces, getMains } =
  ingredientsSlice.selectors;
