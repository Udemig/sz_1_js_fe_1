import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatHttpApi } from "../../utils/api";
import { AsyncStatus } from "./utils";

/* api objesini burada tutarsak uygulama boyunca sadece bir tane
api objemiz olur, o zaman da axios'un eski halini (yani güncellenmemiş
halini) kullanmış oluruz. */
//const api = chatHttpApi();

export type AuthLoginDataType = {
  username: string;
  password: string;
};

export type AuthRegisterDataType = {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: "male" | "female" | "prefer_not_to_say";
};

/* Thunk isimleri ile url adresleri birbirine benzemesin diye thunk isimlerinde
slaş yerine nokta kullanalım. */
export const loginAction = createAsyncThunk(
  "auth.login",
  async (data: AuthLoginDataType, thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.post("/auth/login", data);

    return response.data;
  }
);

export const registerAction = createAsyncThunk(
  "auth.register",
  async (data: AuthRegisterDataType, thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.post("/auth/register", data);

    return response.data;
  }
);

export const logoutAction = createAsyncThunk(
  "auth.logout",
  async (data: undefined, thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.post("/user/logout", data);

    return response.data;
  }
);

export const getUserInfoAction = createAsyncThunk(
  "user.me",
  async (thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.get("/user/me");
    return response.data;
  }
);

export type UserType = {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  gender: string;
};

export interface AuthStateType {
  token: string | null;
  requestStatus: AsyncStatus;
  user: UserType | null;
  errorMessage: string | null;
}

const initialState: AuthStateType = {
  token: localStorage.getItem("token"),
  requestStatus: "idle",
  user: null,
  errorMessage: null,
};

export const authSlice = createSlice({
  initialState,
  name: "authSlice",
  reducers: {},
  extraReducers: (builder) => {
    // login action
    builder.addCase(loginAction.pending, (state, action) => {
      state.token = null;
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.token = null;
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      console.log("Login action fulfilled.");
      console.log(">> 🚀 file: authSlice.ts:102 🚀 action:", action.payload);

      if (action.payload.status === "error") {
        state.errorMessage = action.payload.errorMessage;
        state.requestStatus = "fulfilled";
        return;
      }

      localStorage.setItem("token", action.payload.data.token);
      state.token = action.payload.data.token;
      state.user = action.payload.data.user;
      state.errorMessage = null;
      state.requestStatus = "fulfilled";
    });

    // register action
    builder.addCase(registerAction.pending, (state, action) => {
      state.token = null;
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.token = null;
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      // TODO Add status check condition here.
      // TODO localStorage'daki token bazen undefined oluyor, bu problemi çöz.

      //localStorage.setItem("token", action.payload.data.token);
      //state.token = action.payload.data.token;
      state.requestStatus = "fulfilled";
      state.errorMessage = null;
    });

    // logout action
    builder.addCase(logoutAction.pending, (state, action) => {
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.requestStatus = "fulfilled";
      state.errorMessage = null;
    });

    // get user info action
    builder.addCase(getUserInfoAction.pending, (state, action) => {
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(getUserInfoAction.rejected, (state, action) => {
      state.token = null;
      state.user = null;
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(getUserInfoAction.fulfilled, (state, action) => {
      if (action.payload.status === "success") {
        state.user = action.payload.data.user;
      } else {
        localStorage.removeItem("token");
        state.token = null;
        state.user = null;
        state.errorMessage = action.payload.errorMessage;
      }

      state.requestStatus = "fulfilled";
    });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
