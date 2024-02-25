import {
  createAsyncThunk,
  createSlice,
  
} from '@reduxjs/toolkit';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { ApiError, DeleteResponse } from '@/types/responseTypes';
import download from 'js-file-download'

export interface Upload {
  id: number;
  name: string;
  size: number;
}

interface downloadArguments {
  id: number;
  name: string;
}


interface mainContentState {
  Fetching: boolean;
  message?:string;
  data: Upload[]; // Array of Upload objects
  error: ApiError | null; // Error state can be an ApiError object or null if there's no error
  status: 'idle' | 'loading' | 'succeeded' | 'failed';

}

const initialState: mainContentState = {
  Fetching: true,
  data: [], // Initialize as an empty array
  error:null,
  status: 'idle',
};



const mainContentSlice = createSlice({
  name: 'mainContent',
  initialState,
  reducers: {
    isFetching: (state) => {
      state.Fetching = true;
    },
    notFetching: (state) => {
      state.Fetching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAsync.pending, (state) => {
        console.log('getAsync is pending...');
        state.Fetching = true;
        state.status = 'loading';
      })
      .addCase(getAsync.fulfilled, (state, action: PayloadAction<Upload[]>) => {
        console.log('getAsync is fulfilled!');
        state.Fetching = false;
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getAsync.rejected, (state, action) => {
        console.log('getAsync is rejected');
        state.Fetching = false;
        state.error = {
          message: action.error.message || 'Unknown error occurred',
        };
        state.status = 'failed';
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
        state.status = 'succeeded';
      })
      .addCase(uploadAsync.pending, (state) => {
        console.log('uploadAsync is pending...');
        state.Fetching = true;
        state.status = 'loading';
      })
      .addCase(uploadAsync.fulfilled, (state, action) => {
        console.log('uploadAsync is fulfilled...');
        state.Fetching = false;
        state.data = [...state.data, action.payload];
        state.status = 'succeeded';
      })
      .addCase(downloadAsync.pending, (state) => {
        console.log('downloadAsync is pending...');
        state.status = 'loading';
      })
      .addCase(downloadAsync.fulfilled, (state) => {
        console.log('download is fulfilled...');
        state.status = 'succeeded';
      });
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
  async ({id, name}: downloadArguments) => {
    const url = `http://127.0.0.1:3000/uploads/${id}?download=1`;
    const {data: blob} = await axios.get(url, {
      responseType: "blob",
    });
    download(blob, name)
  }
);

export const uploadAsync = createAsyncThunk(
  'mainContentSlice/uploadAsync',
  async (formData: FormData)=> {
    const url = `http://127.0.0.1:3000/uploads/`;
    const res = await axios.post(url, formData); 
    return res.data;
  }
);



export const { isFetching,notFetching, } =
  mainContentSlice.actions;

export default mainContentSlice.reducer;
