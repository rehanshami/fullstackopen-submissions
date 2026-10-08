import { useState } from "react";
import blogService from "../services/blogs";

function CreateBlogForm({ onCreateBlog, onShowNotification }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const createBlog = async (e) => {
    e.preventDefault();
    const blog = {
      title,
      author,
      url,
    };
    try {
      const newBlog = await blogService.create(blog);
      onCreateBlog(newBlog);
      setTitle("");
      setAuthor("");
      setUrl("");
      onShowNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
      );
      setTimeout(() => {
        onShowNotification("");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateBlogForm;
