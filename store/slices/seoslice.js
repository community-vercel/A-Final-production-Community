import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk to fetch SEO data
export const fetchSeoData = createAsyncThunk(
  'seo/fetchSeoData',
  async (section, { rejectWithValue }) => {
    try {
        const serverurl = process.env.NEXT_PUBLIC_DJANGO_URL;

      const response = await fetch(`${serverurl}get-seo?section=${section}`);
      if (!response.ok) {
        throw new Error('Failed to fetch SEO data');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const seoSlice = createSlice({
  name: 'seo',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSeoData(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSeoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSeoData } = seoSlice.actions;
export default seoSlice.reducer;