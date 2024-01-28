import { ReactNode, createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MessageType } from "../../utils/api";
import { showSwal } from "../../utils/functions";

export type IncomingMessageDataType = {
  message: MessageType;
  sender: {
    username: string;
  };
};

export type LastIncomingMessageType = IncomingMessageDataType | null;

export type WebsocketContextValueType =
  | {
      subscribeRoom: (roomId: string) => void;
      unsubscribeRoom: (roomId: string) => void;
      lastIncomingMessage: LastIncomingMessageType;
      lastRoomEvent: any;
    }
  | undefined;

export type WebsocketContextPropsType = {
  children: ReactNode;
};

export const WebsocketContextReal =
  createContext<WebsocketContextValueType>(undefined);

const websocket = new WebSocket(import.meta.env.VITE_CHAT_API_WEBSOCKET_URL);

export default function WebsocketContext(props: WebsocketContextPropsType) {
  const authState = useSelector((state: RootState) => state.authState);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [lastIncomingMessage, setLastIncomingMessage] =
    useState<LastIncomingMessageType>(null);

  // TODO any yerine olması gereken type'ı tanımla
  const [lastRoomEvent, setLastRoomEvent] = useState<any>(null);

  useEffect(() => {
    console.log(">> Websocket context user: ", authState.user);

    if (
      !isLoggedIn &&
      websocket.readyState === WebSocket.OPEN &&
      authState.user
    ) {
      websocket.send(
        JSON.stringify({
          command: "auth/login",
          token: authState.token,
        })
      );
      setIsLoggedIn(true);
    }
  }, [authState.user]);

  const contextValue: WebsocketContextValueType = {
    lastRoomEvent,
    lastIncomingMessage,

    // room'a subscribe/unsubscribe olmak için gerekli olan fonksiyonları buraya yaz
    subscribeRoom: (roomId: string) => {
      console.log("Subscribing to that room: ", roomId, isLoggedIn);

      if (isLoggedIn) {
        websocket.send(
          JSON.stringify({
            command: "room/join",
            id: roomId,
          })
        );
      }
    },

    unsubscribeRoom: (roomId: string) => {
      console.log("Unsubscribing from that room: ", roomId, isLoggedIn);

      if (isLoggedIn) {
        // Eğer login olmuşsa herhangi bir room'dan unsubscribe olabiliriz.
        websocket.send(
          JSON.stringify({
            command: "room/exit",
            id: roomId,
          })
        );
      }
    },
  };

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

    // TODO Reconnection işlemi için daha iyi bir yöntem bul.
    showSwal("error", "Websocket bağlantısı koptu, sayfa tekrar.");
    setTimeout(() => {
      document.location.reload();
    }, 3_000);
  };

  /* Backend'den frontend'e gelen mesajların karşılandığı fonksiyon burası.
  Dolayısıyla gelen mesajların işlenmesi gereken yer de burası. */
  const onWebsocketMessage = (event: MessageEvent<any>) => {
    console.log(">> 🚀 event:", event);
    console.log("Message from server ", event.data);

    /*
Aşağıdaki datanın type'ını oluşturmamız gerekiyor. Eğer oluşturmazsak birsürü
problemle karşılaşacağız. Öncelikle oluşabilecek olan problemleri bi görelim.
{
  "command": "incoming_message",
  "data": {
    "message": {
      "userId": "65880eda3966777fdb7cbd12",
      "roomId": "659a6cc6d0a678f0bc7cb2ba",
      "type": "text",
      "text": "merhaba dünya",
      "_id": "65aba2cdefe8315f71405a4f",
      "createdAt": "2024-01-20T10:39:09.618Z",
      "updatedAt": "2024-01-20T10:39:09.618Z",
      "__v": 0
    },
    "sender": {
      "username": "test1"
    }
  }
}
*/

    try {
      // Burada incomingJson'ın türü `any` olduğu için buradan gelen
      // `data` property'sini heryerde kullanmak mümkün. Ama bunu dikkatli
      // şekilde kullanmamız gerekiyor ve emin olmamız gerekiyor.
      const incomingJson = JSON.parse(event.data);
      console.log(">> 🚀 incomingJson:", incomingJson);

      if (incomingJson.hb) {
        return;
      } else if (incomingJson.command === "incoming_message") {
        // Context'e ait olan bir state'i güncelle.
        setLastIncomingMessage(incomingJson.data);
      } else if (incomingJson.command === "peer_unsubscribed") {
        setLastRoomEvent(incomingJson.data);
      } else if (incomingJson.command === "peer_subscribed") {
        setLastRoomEvent(incomingJson.data);
      } else if (incomingJson.command === "incoming_message") {
      }
    } catch (e) {}
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
    <WebsocketContextReal.Provider value={contextValue}>
      {props.children}
    </WebsocketContextReal.Provider>
  );
}
