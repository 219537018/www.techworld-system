import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not Authorized Login Again' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id }; // to match your usage: req.user._id
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

export default authUser;
