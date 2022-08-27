const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { User } = require("../models");
const { SECRET } = require("../util/config");

router.post("/", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  console.log("!user", user);

  const passwordCorrect = req.body.password === "secret";

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    id: user.id,
    username: user.username,
  };
  const token = jwt.sign(userForToken, SECRET);

  res.json({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = router;
