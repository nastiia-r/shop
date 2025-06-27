import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserItem = {
  id: number | null;
  email: string | null;
  role: "guest" | "client" | "admin";
  token: string | null;
};

type UserState = {
  items: UserItem[];
};

const initialState: UserItem = {
  id: null,
  email: null,
  role: "guest",
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        id: number;
        email: string;
        role: "client" | "admin";
        token: string;
      }>
    ) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(state));
    },
    logout(state) {
      state.id = null;
      state.email = null;
      state.role = "guest";
      state.token = null;
      localStorage.removeItem("user");
    },
    restore(state) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        state.id = parsed.id;
        state.email = parsed.email;
        state.role = parsed.role;
        state.token = parsed.token;
      }
    },
  },
});

export const { login, logout, restore } = userSlice.actions;

