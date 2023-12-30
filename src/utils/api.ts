import axios, { AxiosInstance } from "axios";

export const chatHttpApi: () => AxiosInstance = () => {
  const api = axios.create();

  api.defaults.baseURL = import.meta.env.VITE_CHAT_API_HTTP_URL;

  api.defaults.headers.common["Content-Type"] =
    "application/json; charset=utf-8";

  // TODO Configure the api object.

  return api;
};
