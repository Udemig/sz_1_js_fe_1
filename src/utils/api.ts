import axios, { AxiosInstance } from "axios";

export const chatHttpApi: () => AxiosInstance = () => {
  const api = axios.create();

  api.defaults.baseURL = import.meta.env.VITE_CHAT_API_HTTP_URL;

  api.defaults.headers.common["Content-Type"] =
    "application/json; charset=utf-8";

  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return api;
};

export type ChatApiResponseType<T> =
  | {
      status: "error";
      errorMessage: string;
    }
  | {
      status: "success";
      data: T;
    };

export type MessageType = {
  _id: string;
  userId: string;
  roomId: string;
  type: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type RoomType = {
  _id: string;
  userId: string;
  name: string;
  visibility: "public" | "private";
  maxClient: number;
};

export type UserType = {
  _id: string;
  username: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  gender?: "male" | "female" | "prefer_not_to_say";
};

export type RoomInfoType = {
  room: RoomType;
  peers: UserType[];
};

// TODO Room response type'ını buraya yaz.
