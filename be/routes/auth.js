const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/pg');

// In-memory user storage (in production, use a database)
// const users = [
//   {
//     id: 1,
//     username: 'admin',
//     email: 'admin@example.com',
//     role: 'admin',
//     password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: password
//   }
// ];

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Register new user
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Validate input
//     if (!username || !email || !password) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Username, email, and password are required' 
//       });
//     }

//     // Check if user already exists
//     const existingUser = users.find(user => 
//       user.username === username || user.email === email
//     );
    
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'User already exists' 
//       });
//     }

//     // Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create new user
//     const newUser = {
//       id: users.length + 1,
//       username,
//       email,
//       role,
//       password: hashedPassword
//     };

//     users.push(newUser);

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: newUser.id, username: newUser.username },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         user: {
//           id: newUser.id,
//           username: newUser.username,
//           email: newUser.email,
//           role: newUser.role
//         },
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Internal server error' 
//     });
//   }
// });

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    const usrName = req.body.username;
    const userLogin =  await pool.query('SELECT * FROM users WHERE username = $1', [usrName]);
    const user = userLogin.rows[0];

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User Not Found' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          language: user.language
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

module.exports = router; 