function Notification({ message }) {
  if (!message) {
    return null;
  }
  return (
    <div
      className={message.successful ? "notification-add" : "notification-error"}
    >
      {message.message}
    </div>
  );
}

export default Notification;
