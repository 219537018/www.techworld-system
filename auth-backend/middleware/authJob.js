import jwt from 'jsonwebtoken';

// Middleware to authenticate users
const authJob = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;  // ✅ Used in controllers like applyForJob & getMyApplications
    req.user = decoded;       // ✅ Optional if you need full user info in future
    next();
  } catch (error) {
    console.error("❌ JWT Error:", error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again.' });
  }
};

export default authJob;
