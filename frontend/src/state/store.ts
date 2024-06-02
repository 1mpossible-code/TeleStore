import { configureStore } from '@reduxjs/toolkit';
import mainContentReducer from './mainContent/mainContentSlice'; // Adjust the path as needed

export const store = configureStore({
  reducer: { mainContent:mainContentReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
