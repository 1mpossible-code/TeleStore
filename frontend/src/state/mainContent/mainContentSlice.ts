import {
    createAsyncThunk,
    createSlice,

} from '@reduxjs/toolkit';
import axios from 'axios';
import {PayloadAction} from '@reduxjs/toolkit';
import {ApiError, DeleteResponse} from '@/types/responseTypes';
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
    message?: string;
    data: Upload[]; // Array of Upload objects
    error: ApiError | null; // Error state can be an ApiError object or null if there's no error
    status: string;
    showToast:boolean;
    selectedAmt:number;
    actionCounter:number;
}

const initialState: mainContentState = {
    Fetching: true,
    data: [], // Initialize as an empty array
    error: null,
    status: 'idle',
    showToast:false,
    selectedAmt:0,
    actionCounter:0
};


const mainContentSlice = createSlice({
    name: 'mainContent',
    initialState,
    reducers: {
        isFetching: (state) => {
            state.Fetching = true;
        },
        setToast: (state) => {
            state.showToast = false;
        },
        setSelected:(state,action:PayloadAction<number>)=>{
            state.selectedAmt = action.payload;
        },incrementAction(state){
            state.actionCounter += 1;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAsync.pending, () => {
                console.log('getAsync is pending...');
            })
            .addCase(getAsync.fulfilled, (state, action: PayloadAction<Upload[]>) => {
                console.log('getAsync is fulfilled!');
                state.Fetching = false;
                state.data = action.payload.reverse();
            })
            .addCase(getAsync.rejected, (state, action) => {
                console.log('getAsync is rejected');
                state.Fetching = false;
                state.showToast = true;

                state.error = {
                    message: action.error.message || 'Unknown error occurred',
                };
                state.status = 'failed to load content';

            })
            .addCase(deleteAsync.pending, (state) => {
                console.log('deleteAsync is pending...');
                state.showToast = true;
                state.status = state.selectedAmt ? `Removing ${state.selectedAmt} file(s)...` : `Removing file...`;
            })
            .addCase(deleteAsync.fulfilled, (state, action) => {
                console.log('deleteAsync is fulfilled!');
                state.message = action.payload.message;
                state.data = state.data.filter(
                    (upload) => upload.id !== action.meta.arg
                );

                if (state.selectedAmt ){
                    if(state.selectedAmt === state.actionCounter){
                        state.showToast = true;
                        state.status = `Successfully removed ${state.selectedAmt} file(s)!`
                        state.actionCounter = 0
                    }
                }else{
                    state.showToast = true;
                    state.status = `Successfully removed a file!`;
                }
            })
            .addCase(uploadAsync.pending, (state) => {
                console.log('uploadAsync is pending...');
                state.showToast = true;
                state.status = state.selectedAmt ? `Uploading ${state.selectedAmt} file(s)!` : `Uploading file...`;
            })
            .addCase(uploadAsync.fulfilled, (state, action) => {
                console.log('uploadAsync is fulfilled...');
                state.data = [action.payload, ...state.data];

                if (state.selectedAmt ){
                    if(state.selectedAmt === state.actionCounter){
                        state.showToast = true;
                        state.status = `Successfully uploaded ${state.selectedAmt} file(s)!`
                        state.actionCounter = 0
                    }
                }else{
                    state.showToast = true;
                    state.status = `Successfully uploaded a file!`;
                }
            })
            .addCase(downloadAsync.pending, (state) => {
                console.log('downloadAsync is pending...');
                state.status = 'loading';
                state.showToast = true;
                state.status = "Downloading fil(e)s..."

            })
            .addCase(downloadAsync.fulfilled, (state) => {
                console.log('download is fulfilled...');
                state.showToast = true;
                state.status = state.selectedAmt ? `Successfully downloaded ${state.selectedAmt} file(s)!` : `Successfully downloaded file!`;
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
    async (formData: FormData) => {
        const url = `http://127.0.0.1:3000/uploads/`;
        const res = await axios.post(url, formData);
        return res.data;
    }
);


export const {isFetching, setToast,setSelected,incrementAction} =
    mainContentSlice.actions;

export default mainContentSlice.reducer;
