import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from './../../utils/types';

export interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    setOtherIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = [
        ...state.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        )
      ];
    },

    moveIngredient: (state, action) => {
      state.ingredients.splice(
        action.payload.to,
        0,
        state.ingredients.splice(action.payload.from, 1)[0]
      );
    }
  },
  selectors: {
    getConstructor: (state) => state
  }
});

export const {
  setBun,
  setOtherIngredients,
  deleteIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export const { getConstructor } = constructorSlice.selectors;
export const constructorReducer = constructorSlice.reducer;
