import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from './../../utils/types';

export interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[] | [];
}

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const isActionRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isActionPending = (action: { type: string }) =>
  action.type.endsWith('pending');

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    setOtherIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients = [...state.ingredients, action.payload];
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    deleteIngredient: (state, action) => {
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

export const { setBun, setOtherIngredients, deleteIngredient, moveIngredient } =
  constructorSlice.actions;
export const { getConstructor } = constructorSlice.selectors;
