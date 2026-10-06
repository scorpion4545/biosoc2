import dotenv from 'dotenv';

dotenv.config();

export const verifyAdmin = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];

  if (!adminPassword) {
    return res.status(401).json({
      success: false,
      message: 'Admin password is required'
    });
  }

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin password'
    });
  }

  next();
};
