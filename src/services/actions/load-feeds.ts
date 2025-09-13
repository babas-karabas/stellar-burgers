import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';

export const loadFeeds = createAsyncThunk('feeds/getFeeds', async () =>
  getFeedsApi()
);
