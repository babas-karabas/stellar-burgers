import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TRegisterData,
  loginUserApi,
  getUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { getCookie, setCookie } from '../../utils/cookie';
import { AppDispatch } from '../store/store';
import { setIsAuthChecked } from '../slices/auth-slice';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  }
);

export const getUserThunk = createAsyncThunk(
  'users/getUser',
  async (__, { rejectWithValue }) => {
    const data = await getUserApi();
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data.user;
  }
);

export const checkUserAuth = () => (dispatch: AppDispatch) => {
  if (getCookie('accessToken')) {
    dispatch(getUserThunk()).finally(() => dispatch(setIsAuthChecked()));
  } else {
    dispatch(setIsAuthChecked());
  }
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi({ email, name, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    { email, name, password }: Partial<TRegisterData>,
    { rejectWithValue }
  ) => {
    const data = await updateUserApi({ email, name, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (__, { rejectWithValue }) => {
    const data = await logoutApi();
    if (!data?.success) {
      return rejectWithValue(data);
    }
    localStorage.setItem('refreshToken', '');
    setCookie('accessToken', '');
    return data.success;
  }
);
