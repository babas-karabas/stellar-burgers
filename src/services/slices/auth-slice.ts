import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUser,
  getUserThunk,
  registerUser,
  updateUser,
  logoutUser
} from '../actions/user-actions';

export interface TUserState {
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

const isRejected = (action: { type: string }) =>
  action.type.endsWith('rejected');

const isPending = (action: { type: string }) => action.type.endsWith('pending');

const hasPrefix = (action: { type: string }, prefix: string) =>
  action.type.startsWith(prefix);

export const isPendingAction = (prefix: string) => (action: { type: string }) =>
  hasPrefix(action, prefix) && isPending(action);

export const isRejectedAction = (prefix: string) => (action: { type: string }) =>
  hasPrefix(action, prefix) && isRejected(action);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addMatcher(isPendingAction('auth'), (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addMatcher(isRejectedAction('auth'), (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = `Error of ${action.type}`;
      });
  }
});

export const { setIsAuthChecked } = authSlice.actions;
export const { getUser, getIsAuthChecked, getIsAuthenticated } =
  authSlice.selectors;
export const authReducer = authSlice.reducer;
