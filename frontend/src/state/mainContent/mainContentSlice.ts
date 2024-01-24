import {
  createAsyncThunk,
  createSlice,
  
} from '@reduxjs/toolkit';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { ApiError, DeleteResponse } from '@/types/responseTypes';

export interface Upload {
  id: number;
  name: string;
  size: number;
}



interface mainContentState {
  loading: boolean;
  message?:string;
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
        console.log('getAsync is fulfilled!');
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAsync.rejected, (state, action) => {
        console.log('getAsync is rejected');
        state.loading = false;
        state.error = {
          message: action.error.message || 'Unknown error occurred',
        };
      })
      .addCase(deleteAsync.pending, () => {
        console.log('deleteAsync is pending...');
      })
      .addCase(deleteAsync.fulfilled, (state, action) => {
        console.log('deleteAsync is fulfilled!');
        state.message = action.payload.message;
        state.data = state.data.filter(
          (upload) => upload.id !== action.meta.arg
        );
      })
      .addCase(uploadAsync.pending, () => {
        console.log('uploadAsync is pending...');
      })
      .addCase(
        uploadAsync.fulfilled,
        (state, action) => {
          console.log('uploadAsync is fulfilled...');
          state.data = [...state.data, action.payload]
        }
      );
  },
});

export const getAsync = createAsyncThunk(
  'mainContentSlice/getAsync',
  async (): Promise<Array<Upload>> => {
    const url = 'http://127.0.0.1:3000/uploads/';
    const res = await axios.get<Array<Upload>>(url);
    return res.data;
  }
);

export const deleteAsync = createAsyncThunk(
  'mainContentSlice/deleteAsync',
  async (id: number): Promise<DeleteResponse> => {
    const url = `http://127.0.0.1:3000/uploads/${id}`;
    const res = await axios.delete<DeleteResponse>(url);
    return res.data;
  }
);

export const downloadAsync = createAsyncThunk(
  'mainContentSlice/downloadAsync',
  async (id: number) => {
    const url = `http://127.0.0.1:3000/uploads/${id}?download=1`;
    await axios.get(url);
  }
);

export const uploadAsync = createAsyncThunk(
  'mainContentSlice/uploadAsync',
  async (formData: FormData)=> {
    const url = `http://127.0.0.1:3000/uploads/`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const res = await axios.post(url, formData, { headers });
    return res.data;
  }
);



export const { isLoading,notLoading } =
  mainContentSlice.actions;

export default mainContentSlice.reducer;
