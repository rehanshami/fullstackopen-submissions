import { useState } from "react";
import loginService from "../services/login";
import Notification from "./Notification";

function LoginForm({ setUser, onShowNotification }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUser(user);
      onShowNotification(`Signed in as ${user.name}`);
      setTimeout(() => {
        onShowNotification("");
      }, 5000);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      {errorMessage && (
        <Notification message={errorMessage} isSuccess={false} />
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              type="password"
            />
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
