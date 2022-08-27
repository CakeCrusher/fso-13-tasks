const express = require("express");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const { connectToDatabase } = require("./util/db");
const { PORT } = require("./util/config");

const app = express();
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);

app.use((err, req, res, next) => {
  if (err.message === "input error") {
    res.status(400);
    res.json({ error: "input error" });
  }
  if (err.message === "not email format error") {
    res.status(400);
    res.json({ error: ["Validation isEmail on username failed"] });
  }
  if (err.message === "not authorized") {
    res.status(404);
    res.json({ error: "not authorized" });
  }
  next(err);
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

start();
