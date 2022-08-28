const router = require("express").Router();
const { User } = require("../models");

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ user });
  } catch (error) {
    if (error.message.includes("Validation isEmail on username failed")) {
      throw Error("not email format error");
    }
    console.log(error);
    throw Error("input error");
  }
});

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    await user.update({ username: req.body.username });
    res.json({ username: req.body.username });
  } else {
    res.status(400).json({ error: "user not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
  }
  res.status(204).end();
});

module.exports = router;
