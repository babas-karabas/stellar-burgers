import { configureStore, combineSlices } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from '../slices/ingredients-slice';
import { authSlice } from '../slices/auth-slice';
import { constructorSlice } from '../slices/constructor-slice';
import { feedsSlice } from '../slices/feeds-slice';
import { orderSlice } from '../slices/order-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  authSlice,
  constructorSlice,
  feedsSlice,
  orderSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
