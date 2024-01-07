export type TextMessagePropsType = {
  // TODO Diğer propertylerin neler olabileceğini düşün.
  sender_name: string;
  message: string;
};

export default function TextMessage(props: TextMessagePropsType) {
  return (
    <div className="chat-message-left pb-4">
      <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
        <strong className="font-weight-bold mb-1">{props.sender_name}:</strong>
        <br />
        {props.message}
      </div>
    </div>
  );
}
