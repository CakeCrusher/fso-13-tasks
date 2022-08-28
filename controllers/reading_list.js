const router = require("express").Router();
const { UserBlogs, Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.body.blogId);
  if (blog) {
    const userBlog = await UserBlogs.create({
      blogId: blog.id,
      userId: req.decodedToken.id,
    });
    res.json(userBlog);
  }
  // blog not found
  throw Error("input error");
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const userBlog = await UserBlogs.findByPk(req.params.id);
  if (userBlog) {
    await userBlog.update({
      read: true,
    });
    res.json({ read: true });
  }
  throw Error("input error");
});

module.exports = router;
