const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      const sessions = await Session.scope({
        method: ["hasSession", req.decodedToken.id],
      }).findAll();
      const user = await User.scope("notDisabled").findByPk(
        req.decodedToken.id
      );
      console.log("!user: ", user);
      if (!sessions.length || !user) {
        return res.status(401).json({ error: "token invalid" });
      }
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { tokenExtractor };
