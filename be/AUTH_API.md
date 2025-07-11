# Authentication API Documentation

This API provides authentication functionality using JWT tokens and bcrypt for password hashing.

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 2,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
**POST** `/api/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 2,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get User Profile
**GET** `/api/auth/profile`

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 4. Logout
**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Protected Routes

The following routes require authentication (include `Authorization: Bearer <token>` header):

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Default User

A default user is available for testing:
- **Username:** `admin`
- **Email:** `admin@example.com`
- **Password:** `password`

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Username, email, and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## Usage Examples

### Using cURL

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

3. **Access protected route:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'password'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Use token for protected routes
const usersResponse = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Security Notes

1. **JWT Secret:** Change the `JWT_SECRET` in production
2. **Password Hashing:** Passwords are hashed using bcrypt with salt rounds of 10
3. **Token Expiration:** JWT tokens expire after 24 hours
4. **Input Validation:** Basic validation is implemented for required fields
5. **Error Handling:** Proper error responses are returned for various scenarios

## Dependencies

- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation and verification
- `express` - Web framework 