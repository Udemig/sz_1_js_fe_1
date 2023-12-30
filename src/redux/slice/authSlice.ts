import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatHttpApi } from "../../utils/api";

const api = chatHttpApi();

export type AuthLoginDataType = {
  username: string;
  password: string;
};

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data: AuthLoginDataType, thunkAPI) => {
    const response = await api.post("/auth/login", data);
    console.log(">> 🚀 file: authSlice.ts:15 🚀 response:", response.data);

    return response.data;
  }
);

export interface AuthStateType {
  token: string | null;
}

const initialState: AuthStateType = {
  token: null,
};

export const authSlice = createSlice({
  initialState,
  name: "authSlice",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginAction.fulfilled, (state, action) => {
      console.log(">> 🚀 file: authSlice.ts:35 🚀 action:", action);

      state.token = null;
    });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
