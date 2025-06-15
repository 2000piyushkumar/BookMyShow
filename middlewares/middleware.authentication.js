const jwt = require('jsonwebtoken');

const { verifyToken } = require("../utils/util.token");

const JWT_SECRET = "efrofroifnrofjerofnroifnirhfnirefvbriufvbiurf";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader){
    return res.status(401).json({ error: "Please authenticate to use this resource." })
  }

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Please authenticate to use this resource." });
  }

  const payload = verifyToken(token);

  if (!payload){
    return res.status(401).json({ error: "Invalid token." });
  }

  req.user = payload;

  next();
};

module.exports = authenticateToken;