import { ReactNode, createContext, useEffect, useState } from "react";

export type WebsocketContextValueType = {};

export type WebsocketContextPropsType = {
  children: ReactNode;
};

const WebsocketContextProvider = createContext<WebsocketContextValueType>({});

export default function WebsocketContext(props: WebsocketContextPropsType) {
  const [websocket, setWebsocket] = useState<WebSocket>(
    new WebSocket(import.meta.env.VITE_CHAT_API_WEBSOCKET_URL)
  );

  const contextValue: WebsocketContextValueType = {};

  useEffect(() => {
    websocket.addEventListener("open", (event) => {
      websocket.send(
        JSON.stringify({
          // hb: heartbeat
          hb: Date.now(),
        })
      );
    });

    websocket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });

    websocket.addEventListener("close", (event) => {
      console.log("Remote connection closed.");
    });

    websocket.addEventListener("error", (event) => {
      console.log("Remote connection error occured:", event);
    });

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <WebsocketContextProvider.Provider value={contextValue}>
      {props.children}
    </WebsocketContextProvider.Provider>
  );
}
