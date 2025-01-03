const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]
  // console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    console.log(decoded)
    req.user = {
      _id: decoded.userId,
      username: decoded.username,
      email: decoded.email, 
      userType: decoded.userType,
      authorityType: decoded.authorityType,
    };


    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Not authorized to access this route' });
  }
}

module.exports = {authenticationMiddleware}
