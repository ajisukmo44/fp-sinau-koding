const jwt = require('jsonwebtoken');

// JWT secret (should match the one in auth routes)
const JWT_SECRET = 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = { authenticateToken }; 