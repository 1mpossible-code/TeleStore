import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';

export interface Upload {
  id: number;
  name: string;
  size: number;
}

interface ApiError {
  message: string;
}

interface mainContentState {
  loading: boolean;
  data: Upload[]; // Array of Upload objects
  error: ApiError | null; // Error state can be an ApiError object or null if there's no error
}

const initialState: mainContentState = {
  loading: true,
  data: [], // Initialize as an empty array
  error:null,
};



const mainContentSlice = createSlice({
  name: 'mainContent',
  initialState,
  reducers: {
    isLoading: (state) => {
      state.loading = true;
    },
    notLoading: (state) => {
      state.loading = false;
    },
  },extraReducers:(builder) =>{
    builder
      .addCase(getAsync.pending, (state) => {
        console.log('getAsync is pending...');
        state.loading = true;
      })
      .addCase(getAsync.fulfilled, (state, action: PayloadAction<Upload[]>) => {
        console.log('getAsync is fufilled!');
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAsync.rejected, (state, action) => {
        console.log('getAsync is rejected');
        state.loading = false;
        state.error = {
          message: action.error.message || 'Unknown error occurred',
        };
      });
  },
});

export const getAsync = createAsyncThunk(
  'mainContentSlice/getAsync',
  async (): Promise<Array<Upload>> => {
    const response = await axios.get<Array<Upload>>(
      'http://127.0.0.1:3000/uploads/'
    );
    console.log(response.data);
    return response.data;
  }
);




export const { isLoading,notLoading } =
  mainContentSlice.actions;

export default mainContentSlice.reducer;
