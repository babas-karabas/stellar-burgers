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

      .addCase(loadIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loadIngredients.rejected, (state, action) => {
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
    getIngredientsStatus: (state) => state.loading
  }
});

export const ingredientsActions = ingredientsSlice.actions;
export const {
  getIngredients,
  getIngredientsStatus,
  getBuns,
  getSauces,
  getMains
} = ingredientsSlice.selectors;
