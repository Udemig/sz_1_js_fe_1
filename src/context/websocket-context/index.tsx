import { ReactNode, createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { showSwal } from "../../utils/functions";

export type WebsocketContextValueType = {};

export type WebsocketContextPropsType = {
  children: ReactNode;
};

const WebsocketContextProvider = createContext<WebsocketContextValueType>({});

const websocket = new WebSocket(import.meta.env.VITE_CHAT_API_WEBSOCKET_URL);

export default function WebsocketContext(props: WebsocketContextPropsType) {
  const authState = useSelector((state: RootState) => state.authState);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          command: "auth/login",
          token: authState.token,
        })
      );
      setIsLoggedIn(true);
    }
  }, [authState.user]);

  const contextValue: WebsocketContextValueType = {};

  const onWebsocketOpen = (event: Event) => {
    console.log(">> 🚀 event:", event);
    console.log(">> websocket open event triggered.");

    websocket.send(
      JSON.stringify({
        hb: Date.now(),
      })
    );
  };

  const onWebsocketClose = (event: CloseEvent) => {
    console.log(">> 🚀 event:", event);
    console.log("Remote connection closed.");

    showSwal("error", "Websocket bağlantısı koptu, sayfayı yenileyiniz.");

    // TODO Fix reconnect problem.
  };

  const onWebsocketMessage = (event: MessageEvent<any>) => {
    console.log(">> 🚀 event:", event);
    console.log("Message from server ", event.data);
  };

  const onWebsocketError = (event: Event) => {
    console.log(">> 🚀 event:", event);
    console.log("Remote connection error occured:", event);
  };

  useEffect(() => {
    websocket.addEventListener("open", onWebsocketOpen);
    websocket.addEventListener("close", onWebsocketClose);
    websocket.addEventListener("error", onWebsocketError);

    websocket.addEventListener("message", onWebsocketMessage);

    return () => {
      console.log(">> websocket context unmount executed.");
      //websocket.close();

      websocket.removeEventListener("open", onWebsocketOpen);
      websocket.removeEventListener("close", onWebsocketOpen);
      websocket.removeEventListener("error", onWebsocketOpen);

      websocket.removeEventListener("message", onWebsocketOpen);
    };
  }, []);

  return (
    <WebsocketContextProvider.Provider value={contextValue}>
      {props.children}
    </WebsocketContextProvider.Provider>
  );
}
