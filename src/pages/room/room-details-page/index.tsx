import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SwalToast } from "../../../components/swal-toast";
import {
  IncomingMessageDataType,
  WebsocketContextReal,
} from "../../../context/websocket-context";
import { RootState } from "../../../redux/store";
import {
  ChatApiResponseType,
  RoomInfoType,
  UserType,
  chatHttpApi,
} from "../../../utils/api";
import { formJson, showSwal } from "../../../utils/functions";
import TextMessage from "./components/text-message";
import "./index.css";

export type RoomDetailsParamType = { roomId: string };

export default function RoomDetailsPage() {
  /* Bu sayfaya gelindiğinde ilk olarak room detaylarını almak için bir http isteği
  atacağız. Gelen cevapta room bilgileri ve user listesi olsun. Sonra bu room'a gönderilmiş
  olan son mesajları alacağız. Sonra da websocketten bu room'daki bütün değişikliklere
  subscribe olacağız. (Bu son maddeyi birazdan detaylandıracağım.) */

  const authState = useSelector((state: RootState) => state.authState);
  const navigate = useNavigate();

  const params = useParams<RoomDetailsParamType>();
  console.log(">> 🚀 params:", params);

  const websocketContextData = useContext(WebsocketContextReal);

  console.log(
    ">> lastIncomingMessage:",
    websocketContextData?.lastIncomingMessage
  );

  const chatFormRef = useRef<any>();
  const messagesContainerRef = useRef<any>();

  const [onlineUsers, setOnlineUsers] = useState<UserType[]>([]);

  const [messages, setMessages] = useState<IncomingMessageDataType[]>([]);
  console.log(">> 🚀 messages:", messages);

  useEffect(() => {
    // params.roomId değiştiğinde son mesajları al
    (async () => {
      const api = chatHttpApi();
      const room_id = params.roomId;

      const lastMessages = await api.get<
        ChatApiResponseType<IncomingMessageDataType[]>
      >("room/getMessages", {
        params: {
          room_id,
        },
      });

      console.log(">> 🚀 lastMessages:", lastMessages.data);

      if (lastMessages.data.status === "success") {
        setMessages(lastMessages.data.data);

        setTimeout(() => {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }, 10);
      }
    })();
  }, [params.roomId]);

  useEffect(() => {
    if (websocketContextData?.lastIncomingMessage) {
      setMessages((oldMessagesState: IncomingMessageDataType[]) => {
        const newMsg =
          websocketContextData?.lastIncomingMessage as IncomingMessageDataType;

        const isExist = oldMessagesState.some(
          (item) => item.message._id === newMsg.message._id
        );
        if (isExist) {
          // Bu yeni mesaj id'si bizim mesaj listemizde zaten mevcut olduğu için state'in
          // güncellenmesine gerek yok. Bu yüzden aynı state objesini geri gönderiyoruz.
          return oldMessagesState;
        }

        oldMessagesState.push(
          websocketContextData?.lastIncomingMessage as IncomingMessageDataType
        );

        setTimeout(() => {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }, 10);

        /* Yeni dizi oluşturup return ediyoruz. Çünkü diziler aslında objedir ve eğer oldMessagesState'i
        geri gönderirsek aynı objenin referansını göndermiş oluruz ve referans aynı olduğunda state
        güncellenmez. Bu problemden kurtulmak için yeni bir obje (yani dizi) oluşturuyoruz. */
        return [...oldMessagesState];
      });
    }
  }, [websocketContextData?.lastIncomingMessage]);

  useEffect(() => {
    (async () => {
      // room detaylarını alalım.
      const api = chatHttpApi();
      const roomDetailResponse = await api.get<
        ChatApiResponseType<RoomInfoType>
      >("/room/getById/" + params.roomId);
      console.log(">> 🚀 roomDetailResponse:", roomDetailResponse);

      if (roomDetailResponse.data.status === "success") {
        //roomDetailResponse.data.data.room.name;
        //roomDetailResponse.data.data.peers[0].username;
        setOnlineUsers(roomDetailResponse.data.data.peers);
      }
    })();
  }, [websocketContextData?.lastRoomEvent]);

  useEffect(() => {
    (async () => {
      if (!authState.token) {
        /* Eğer hiç token yoksa o zaman bu sayfada durmaya da gerek yok. Kullanıcıya
        bir mesaj göster ve login sayfasına yönlendir. */
        const loginPageUrl = "/auth/login";

        showSwal("warning", "Lütfen sisteme giriş yapınız.");

        navigate(loginPageUrl);
      }

      console.log(
        ">> Room details page userEffect executed, user: ",
        authState.user
      );

      if (authState.user) {
        console.log(
          ">> User authenticated, subscribing to room, user: ",
          authState.user
        );

        // burada subscribeRoom fonksiyonunu çağır
        websocketContextData?.subscribeRoom(params.roomId as string);

        // room detaylarını alalım.
        const api = chatHttpApi();
        const roomDetailResponse = await api.get<
          ChatApiResponseType<RoomInfoType>
        >("/room/getById/" + params.roomId);
        console.log(">> 🚀 roomDetailResponse:", roomDetailResponse);

        if (roomDetailResponse.data.status === "success") {
          //roomDetailResponse.data.data.room.name;
          //roomDetailResponse.data.data.peers[0].username;
          setOnlineUsers(roomDetailResponse.data.data.peers);
        }

        // rooma ait son mesajları alalım.
        const lastMessageResponse = await api.get("/room/getMessages");
        console.log(">> 🚀 lastMessageResponse:", lastMessageResponse);
      }
    })();

    return () => {
      websocketContextData?.unsubscribeRoom(params.roomId as string);
    };
  }, [params.roomId, authState.user, authState.token]);

  const onChatFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = formJson(e.currentTarget);
    chatFormRef.current.reset();

    if (!formData.message) {
      SwalToast.fire({
        icon: "error",
        title: "Lütfen mesajınızı yazınız",
      });

      return;
    }

    // HTTP API üzerinden bu mesajı sunucuya gönder.
    const api = chatHttpApi();
    const result = await api.post("room/sendMessage", formData);
    console.log(">> 🚀 result:", result);
  };

  return (
    <section className="py-5 container">
      <div className="row">
        <div className="col-lg-3 col-md-3 col-sm-12">
          <ListGroup>
            {onlineUsers.map((item) => (
              <ListGroup.Item
                action
                variant="light"
                className="d-flex justify-content-between align-items-start"
              >
                <Badge bg="primary" pill>
                  <i className="fa-solid fa-user"></i>
                </Badge>
                &nbsp;
                <div className="me-auto">
                  <div className="fw-bold">{item.username}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12">
          <Card className="messages-container">
            <Card.Body ref={messagesContainerRef}>
              {messages.map((item) => {
                return (
                  <TextMessage
                    sender_name={item.sender.username}
                    message={item.message.text}
                  />
                );
              })}
            </Card.Body>
            <Card.Footer>
              <Form
                autoComplete="off"
                ref={chatFormRef}
                onSubmit={onChatFormSubmit}
              >
                <input type="hidden" name="room_id" value={params.roomId} />
                <InputGroup>
                  <Form.Control
                    autoComplete="none"
                    name="message"
                    as="input"
                    aria-label="With textarea"
                  />
                  <Button type="submit" variant="primary">
                    Gönder
                  </Button>
                </InputGroup>
              </Form>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </section>
  );
}
