import type { PayloadAction } from "@reduxjs/toolkit";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChatApiResponseType, chatHttpApi } from "../../utils/api";
import { showSwal } from "../../utils/functions";
import { appDispatch } from "../store";
import { AsyncStatus } from "./utils";

/* api objesini burada tutarsak uygulama boyunca sadece bir tane
api objemiz olur, o zaman da axios'un eski halini (yani güncellenmemiş
halini) kullanmış oluruz. */
//const api = chatHttpApi();

// Bu type hem form'un, hem de sunucuya gönderilecek olan datanın type'ı.
export type CreateRoomDataType = {
  name: string;
  visibility: "public" | "private";
  maxClient: number;
};

export async function createRoomService(value: CreateRoomDataType) {
  const response = await chatHttpApi().post<
    ChatApiResponseType<{ room: RoomType }>
  >("/room/create", value);

  if (response.data.status === "success") {
    await appDispatch(createRoom(response.data.data.room));
    showSwal("success", "Room başarıyla oluşturuldu, iyi eğlenceler.");
    appDispatch(getLastRoomsAction());

    return response.data.data.room;
  } else {
    showSwal("error", response.data.errorMessage);
  }
}

export const createRoomAsyncAction = createAsyncThunk(
  "room.create",
  async (data: CreateRoomDataType, thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.post("/room/create", data);

    return response.data;
  }
);

export const getLastRoomsAction = createAsyncThunk(
  "room.getLastRoom",
  async (data: undefined, thunkAPI) => {
    const api = chatHttpApi();
    const response = await api.get("/public/room/lastRooms");

    return response.data;
  }
);

// TODO Sonradan bu type'ı düzenlememiz gerekebilir, örn userId yerine user yazmak gibi.
export type RoomType = {
  _id: string;
  userId: string;
  name: string;
  visibility: "public" | "private";
  maxClient: number;
  peers?: string[];
};

export interface RoomStateType {
  // TODO Gerekli olan property'lerin neler olabileceğini düşün.
  lastRooms: RoomType[];
  lastRoomsInitialized: boolean;

  userRooms: RoomType[];
  userRoomsInitialized: boolean;

  requestStatus: AsyncStatus;
  errorMessage: string | null;
}

const initialState: RoomStateType = {
  lastRooms: [],
  lastRoomsInitialized: false,

  userRooms: [],
  userRoomsInitialized: false,

  requestStatus: "idle",
  errorMessage: null,
};

export const roomSlice = createSlice({
  initialState,
  name: "roomSlice",
  reducers: {
    createRoom(state, action: PayloadAction<RoomType>) {
      console.log(">> 🚀 file: roomSlice.ts:76 🚀 action:", action);
      console.log(">> 🚀 file: roomSlice.ts:76 🚀 state:", state);
    },
  },
  extraReducers: (builder) => {
    // create room action
    builder.addCase(createRoomAsyncAction.pending, (state, action) => {
      state.requestStatus = "pending";
      state.errorMessage = null;
    });
    builder.addCase(createRoomAsyncAction.rejected, (state, action) => {
      state.requestStatus = "rejected";
      state.errorMessage = null;
    });
    builder.addCase(createRoomAsyncAction.fulfilled, (state, action) => {
      console.log(">> 🚀 file: authSlice.ts:102 🚀 action:", action.payload);

      if (action.payload.status === "error") {
        state.errorMessage = action.payload.errorMessage;
        state.requestStatus = "fulfilled";
        return;
      }

      state.errorMessage = null;
      state.requestStatus = "fulfilled";
    });

    // last room list action
    builder.addCase(getLastRoomsAction.fulfilled, (state, action) => {
      state.lastRooms = action.payload.data.rooms;
      state.lastRoomsInitialized = true;
    });
    // user room list action
  },
});

export const { createRoom } = roomSlice.actions;

export default roomSlice.reducer;

/*

Bir task veya proje yapmanın akış şeması (veya algoritması):

100 - Bir şekilde task'ı veya projeyi çalıştır.
200 - Review yap
300 - Review içine sindi mi? Hayır ise 200'e geç, evet ise devam et.

*/
