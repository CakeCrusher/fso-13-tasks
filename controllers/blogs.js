const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");
const { Op } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search ? req.query.search : "",
          },
        },
        {
          author: {
            [Op.substring]: req.query.search ? req.query.search : "",
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"],
    },
    include: {
      model: User,
      attributes: ["username"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      yearWritten: new Date().getFullYear(),
      userId: user.id,
    });
    res.json(blog);
  } catch (error) {
    console.log("error", error);
    if (error.message.includes("less than or equal to current year")) {
      console.log("!init");
      throw Error("year written invalid");
    }
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
