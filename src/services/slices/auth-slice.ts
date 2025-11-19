import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUser,
  getUserThunk,
  registerUser,
  updateUser,
  logoutUser
} from '../actions/user-actions';

interface TUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(
        getUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loginUserError = null;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export const { setUser } = authSlice.actions;
export const { getUser, getIsAuthChecked, getIsAuthenticated } =
  authSlice.selectors;
