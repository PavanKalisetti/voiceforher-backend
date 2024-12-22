const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    req.user = { id, username }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

const roleMiddleware = (requiredRoles) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!requiredRoles.includes(payload.role)) {
      return res.status(403).json({ error: "Access forbidden" });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};


module.exports = {authenticationMiddleware, roleMiddleware}
