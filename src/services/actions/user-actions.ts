import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TRegisterData,
  loginUserApi,
  getUserApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { setCookie } from '../../utils/cookie';

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
    const res = await updateUserApi({ email, name, password });
    if (!res) {
      return rejectWithValue(data);
    }
    return data.user;
  }
);
