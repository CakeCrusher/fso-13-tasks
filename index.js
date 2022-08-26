const express = require("express");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const { connectToDatabase } = require("./util/db");
const { PORT } = require("./util/config");

const app = express();
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use((err, req, res, next) => {
  if (err.message === "input error") {
    res.status(400);
    res.json({ error: "input error" });
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
