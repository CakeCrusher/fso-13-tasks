const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { User, Session } = require("../models");
const { SECRET } = require("../util/config");
const { tokenExtractor } = require("../util/middleware");

router.post("/login", async (req, res) => {
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

  const session = await Session.create({
    userId: user.id,
    token,
  });

  console.log("session: ", session);

  res.json({
    token,
    username: user.username,
    name: user.name,
  });
});

router.post("/logout", tokenExtractor, async (req, res) => {
  // delete the session for this user
  await Session.destroy({
    where: {
      userId: req.decodedToken.id,
    },
  });

  res.status(204).end();
});

module.exports = router;
