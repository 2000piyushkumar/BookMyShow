const authorizeUser = (role) => {
  const roleAccessLevelMapping = {
    admin: 0,
    user: 9,
  }
  return (req, res, next) => {
    if (req.user && roleAccessLevelMapping[req.user.role] <= roleAccessLevelMapping[role]) {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized Access." });
  };
};

module.exports = authorizeUser;