import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

const initialState = {
  user: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    }
  },
  selectors: {
    getUser: (state) => state.user
  }
});

export const {  } = authSlice.actions;
export const { getUser } = authSlice.selectors;
