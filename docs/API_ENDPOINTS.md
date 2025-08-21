# API Endpoints Documentation

## Overview
This document provides detailed information about all available API endpoints in the RemittanceApp backend.

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints Summary

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/health` | No | Health check |
| GET | `/` | No | API information |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | User login |
| GET | `/api/auth/profile` | Yes | Get user profile |
| PUT | `/api/auth/profile` | Yes | Update user profile |
| GET | `/api/wallet/wallets` | Yes | Get user wallets |
| GET | `/api/wallet/transactions` | Yes | Get transaction history |
| GET | `/api/wallet/exchange-rates` | Yes | Get exchange rates |
| GET | `/api/wallet/beneficiaries` | Yes | Get beneficiaries |
| POST | `/api/wallet/send-money` | Yes | Send money transfer |
| POST | `/api/wallet/create-customer` | Yes | Create Nium customer |

---

## Health & Info Endpoints

### GET /health
**Description:** Server health check  
**Authentication:** Not required  
**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "timestamp": "2025-01-21T11:34:00.486Z",
    "environment": "development",
    "version": "1.0.0"
  }
}
```

### GET /
**Description:** API information and available endpoints  
**Authentication:** Not required  
**Response:**
```json
{
  "success": true,
  "message": "RemittanceApp API Server",
  "data": {
    "version": "1.0.0",
    "endpoints": [
      "GET /health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      // ... more endpoints
    ]
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/register
**Description:** Register a new user account  
**Authentication:** Not required  

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters  
- `email`: Required, valid email format, unique
- `phoneNumber`: Required, valid phone format
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, number

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "isEmailVerified": false,
      "_id": "user-id",
      "createdAt": "2025-01-21T11:34:00.687Z",
      "niumCustomerHashId": "mock_customer_id"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `409` - Email already exists

### POST /api/auth/login
**Description:** User login with email and password  
**Authentication:** Not required  

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user-id",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "niumCustomerHashId": "mock_customer_id"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Invalid credentials

### GET /api/auth/profile
**Description:** Get current user profile  
**Authentication:** Required (Bearer token)  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "user-id",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "isEmailVerified": false,
    "createdAt": "2025-01-21T11:34:00.687Z",
    "niumCustomerHashId": "mock_customer_id"
  }
}
```

### PUT /api/auth/profile
**Description:** Update user profile  
**Authentication:** Required (Bearer token)  

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Smith",
  "phoneNumber": "+1987654321"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object
  }
}
```

---

## Wallet Endpoints

### GET /api/wallet/wallets
**Description:** Get user's wallets with balances  
**Authentication:** Required (Bearer token)  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Wallets retrieved successfully",
  "data": {
    "wallets": [
      {
        "walletHashId": "wallet_usd_123",
        "currencyCode": "USD",
        "balance": 1250.50,
        "availableBalance": 1250.50,
        "blockedBalance": 0
      },
      {
        "walletHashId": "wallet_eur_456",
        "currencyCode": "EUR",
        "balance": 850.25,
        "availableBalance": 850.25,
        "blockedBalance": 0
      }
    ]
  }
}
```

### GET /api/wallet/transactions
**Description:** Get transaction history  
**Authentication:** Required (Bearer token)  

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 20)
- `offset` (optional): Number of transactions to skip (default: 0)
- `walletId` (optional): Filter by specific wallet

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "transactionId": "txn_001",
        "amount": 500.00,
        "currencyCode": "USD",
        "type": "DEBIT",
        "status": "SUCCESS",
        "description": "Money transfer to John Doe",
        "createdAt": "2025-01-20T11:34:26.979Z",
        "beneficiaryName": "John Doe"
      }
    ]
  }
}
```

### GET /api/wallet/exchange-rates
**Description:** Get real-time exchange rates  
**Authentication:** Required (Bearer token)  

**Query Parameters:**
- `from`: Source currency code (required)
- `to`: Destination currency code (required)

**Example:** `/api/wallet/exchange-rates?from=USD&to=EUR`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Exchange rate retrieved successfully",
  "data": {
    "sourceCurrencyCode": "USD",
    "destinationCurrencyCode": "EUR",
    "exchangeRate": 0.85,
    "inverseExchangeRate": 1.18,
    "timestamp": "2025-01-21T11:34:27.127Z"
  }
}
```

### GET /api/wallet/beneficiaries
**Description:** Get saved beneficiaries  
**Authentication:** Required (Bearer token)  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Beneficiaries retrieved successfully",
  "data": {
    "beneficiaries": []
  }
}
```

### POST /api/wallet/send-money
**Description:** Send money to a beneficiary  
**Authentication:** Required (Bearer token)  

**Request Body:**
```json
{
  "beneficiaryId": "beneficiary_123",
  "amount": 100.00,
  "sourceCurrency": "USD",
  "destinationCurrency": "EUR",
  "purpose": "Family support"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Money transfer initiated successfully",
  "data": {
    "transactionId": "txn_new_123",
    "status": "PENDING",
    "amount": 100.00,
    "exchangeRate": 0.85,
    "fee": 2.50,
    "estimatedDelivery": "2025-01-22T11:34:27.000Z"
  }
}
```

### POST /api/wallet/create-customer
**Description:** Create Nium customer profile  
**Authentication:** Required (Bearer token)  

**Success Response (200):**
```json
{
  "success": true,
  "message": "Nium customer profile created successfully",
  "data": {
    "customerHashId": "nium_customer_123",
    "status": "ACTIVE"
  }
}
```

---

## Error Handling

### Common Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "The requested resource was not found",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "error": {
    "code": "RATE_LIMITED",
    "retryAfter": 900
  }
}
```

---

## Usage Examples

### Frontend Integration (JavaScript/React Native)

```javascript
const API_BASE_URL = 'http://localhost:3001/api';

// Register user
const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Login user
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Get wallets (authenticated)
const getWallets = async (token) => {
  const response = await fetch(`${API_BASE_URL}/wallet/wallets`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

### cURL Examples

```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'

# Get wallets (replace TOKEN with actual JWT)
curl http://localhost:3001/api/wallet/wallets \
  -H "Authorization: Bearer TOKEN"
```
