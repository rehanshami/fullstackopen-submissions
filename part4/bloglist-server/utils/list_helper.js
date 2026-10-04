const dummy = (array) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const blog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  return blogs.reduce((accumulator, blog) => {
    if (accumulator.likes >= blog.likes) {
      return accumulator;
    } else {
      return blog;
    }
  }, blogs[0]);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  // First get authors and their blog counts
  const authorCount = blogs.reduce((accumulator, blog) => {
    if (Object.hasOwn(accumulator, blog.author)) {
      accumulator[blog.author]++;
    } else {
      accumulator[blog.author] = 1;
    }
    return accumulator;
  }, {});

  // Convert object to array
  const authors = Object.entries(authorCount);

  //Get most popular author
  const mostPopularAuthor = authors.reduce((accumulator, author) => {
    if (author[1] >= accumulator[1]) {
      return author;
    }
    return accumulator;
  }, authors[0]);

  return {
    author: mostPopularAuthor[0],
    blogs: mostPopularAuthor[1],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  // First let's return each author with their respective like count
  const authorBlogsTotalLikes = blogs.reduce((accumulator, blog) => {
    if (Object.hasOwn(accumulator, blog.author)) {
      accumulator[blog.author] += blog.likes;
    } else {
      accumulator[blog.author] = blog.likes;
    }
    return accumulator;
  }, {});

  const authors = Object.entries(authorBlogsTotalLikes);

  const authorWithMostLikes = authors.reduce((accumulator, author) => {
    if (author[1] > accumulator[1]) {
      return author;
    } else {
      return accumulator;
    }
  }, authors[0]);

  return {
    author: authorWithMostLikes[0],
    likes: authorWithMostLikes[1],
  };
};
console.log(mostLikes(blog));

module.exports = { dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs };
