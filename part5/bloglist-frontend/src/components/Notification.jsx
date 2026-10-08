function Notification({ message, isSuccess }) {
  const styles = {
    background: "lightgrey",
    border: "2px solid",
    padding: "10px 5px",
    borderRadius: "5px",
  };

  const color = isSuccess ? "green" : "red";

  return (
    <div style={{ ...styles, color }}>
      <h3>{message}</h3>
    </div>
  );
}

export default Notification;
