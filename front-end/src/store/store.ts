import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cart-slice.ts';
import { userSlice } from './user-slice.ts';

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    user: userSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;