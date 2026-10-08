import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  const addBlog = (blog) => {
    setBlogs((blogs) => [...blogs, blog]);
  };

  return (
    <div>
      {user ? (
        <>
          <h2>blogs</h2>
          {notificationMessage && (
            <Notification message={notificationMessage} isSuccess={true} />
          )}
          <div>
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </div>
          <CreateBlogForm
            onCreateBlog={addBlog}
            onShowNotification={setNotificationMessage}
          />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      ) : (
        <LoginForm
          setUser={setUser}
          onShowNotification={setNotificationMessage}
        />
      )}
    </div>
  );
};

export default App;
