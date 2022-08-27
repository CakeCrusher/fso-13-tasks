const jwt = require("jsonwebtoken");
const { User } = require("../../FSO-13/models");
const router = require("express").Router();
const { Blog } = require("../models");
const { SECRET } = require("../util/config");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      res.status(401).json({ error: "token invalid" });
    }
  } else {
    res.status(401).json({ error: "token missing" });
  }
  next();
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"],
    },
    include: {
      model: User,
      attributes: ["username"],
    },
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
    });
    res.json(blog);
  } catch (error) {
    throw Error("input error");
  }
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  if (!req.decodedToken || req.blog.userId !== req.decodedToken.id) {
    throw Error("not authorized");
  }
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    const newLikes = req.blog.likes + 1;
    await req.blog.update({ likes: newLikes });
    res.json({ likes: newLikes });
  }
  throw Error("input error");
});

module.exports = router;
