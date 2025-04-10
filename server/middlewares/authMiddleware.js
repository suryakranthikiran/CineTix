const jwt = require("jsonwebtoken");
require('dotenv').config()

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.body.userId = verifiedToken.userId;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};
