const routes = require("express").Router();
const { Blog } = require("../models");
const { sequelize } = require("../util/db");

routes.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("author")), "articles"],
      [sequelize.fn("COUNT", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  });
  res.json(authors);
});

module.exports = routes;
