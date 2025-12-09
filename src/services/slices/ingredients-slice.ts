import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from './../../utils/types';

import { loadIngredients } from '../actions/load-ingredients';

export interface TIngredientsState {
  data: TIngredient[];
  loading: boolean;
  error: string | undefined;
}

export const initialState: TIngredientsState = {
  data: [],
  loading: false,
  error: undefined
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
        state.error = '';
      })

      .addCase(loadIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
  selectors: {
    getIngredients: (state) => state.data,
    getIngredientsStatus: (state) => state.loading
  }
});

export const ingredientsActions = ingredientsSlice.actions;
export const { getIngredients, getIngredientsStatus } =
  ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
