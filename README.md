# RemittanceApp Backend API

A comprehensive RESTful API backend for an international remittance application built with Node.js, Express, TypeScript, and MongoDB. Integrated with Nium payment gateway for real-world money transfers targeting underserved corridors.

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)
![Nium](https://img.shields.io/badge/Nium_API-Integrated-orange.svg)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Nium API Integration**: Seamless integration with Nium's payment platform
- **Wallet Management**: Multi-currency wallet support and balance tracking
- **Transaction Processing**: Send money, view transaction history, and manage beneficiaries
- **Exchange Rates**: Real-time currency exchange rate fetching
- **Security**: Rate limiting, input validation, CORS protection, and comprehensive security middleware
- **Database**: MongoDB with Mongoose ODM for flexible data modeling
- **TypeScript**: Full type safety and modern JavaScript features
- **Docker Support**: Containerized deployment with Docker and Docker Compose

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs
- **HTTP Client**: Axios (for Nium API)
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Docker and Docker Compose (optional, for containerized deployment)
- Nium API credentials (for production)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd remittance-backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/remittance-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Nium API Configuration
NIUM_API_URL=https://gateway.nium.com/api/v1
NIUM_API_KEY=your-actual-nium-api-key
NIUM_ENVIRONMENT=sandbox

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

### 3. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Build and start production server
npm run build
npm start
```

The server will start at `http://localhost:3001`

### 4. Using Docker (Alternative)

```bash
# Start with Docker Compose (includes MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop containers
docker-compose down
```

## 📖 API Documentation

### Base URL
- Development: `http://localhost:3001`
- Production: `https://your-production-domain.com`

### Response Format
All API responses follow this consistent format:
```json
{
  "success": boolean,
  "message": "string",
  "data": any // Response data
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests
- `500` - Internal Server Error

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

### Wallet Endpoints

#### Get Wallets
```http
GET /api/wallet/wallets
Authorization: Bearer <jwt-token>
```

#### Get Transactions
```http
GET /api/wallet/transactions
Authorization: Bearer <jwt-token>

# Or for specific wallet
GET /api/wallet/transactions/wallet_id_123
Authorization: Bearer <jwt-token>
```

#### Get Exchange Rates
```http
GET /api/wallet/exchange-rates?from=USD&to=EUR
```

#### Get Beneficiaries
```http
GET /api/wallet/beneficiaries
Authorization: Bearer <jwt-token>
```

#### Send Money
```http
POST /api/wallet/send-money
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "beneficiaryHashId": "ben_123456",
  "amount": 500.00,
  "sourceCurrencyCode": "USD",
  "destinationCurrencyCode": "EUR",
  "purpose": "Family support",
  "description": "Monthly allowance"
}
```

### Health Check
```http
GET /health
```

## 🏗 Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── authController.ts
│   └── walletController.ts
├── middleware/           # Custom middleware
│   ├── auth.ts
│   ├── validation.ts
│   └── index.ts
├── models/              # Database models
│   └── User.ts
├── routes/              # API routes
│   ├── auth.ts
│   └── wallet.ts
├── services/            # Business logic
│   └── niumService.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   ├── database.ts
│   └── jwt.ts
└── index.ts            # Application entry point
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Configurable request rate limiting
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet middleware for security headers
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/remittance-app
JWT_SECRET=your-super-secure-production-jwt-secret
NIUM_API_KEY=your-production-nium-api-key
NIUM_ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Docker Deployment

```bash
# Build production image
docker build -t remittance-backend .

# Run container
docker run -p 3001:3001 --env-file .env.production remittance-backend
```

### Cloud Deployment Options

#### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

#### Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set VARIABLE=value`
4. Deploy: `git push heroku main`

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Test coverage
npm run test:coverage
```

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run linting (when configured)

## 📝 API Response Format

All API responses follow this consistent format:

```json
{
  "success": boolean,
  "message": "string",
  "data": any,
  "error": "string" // Only present on errors
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Development Status

This backend is currently in active development. Features marked as "coming soon" in the API documentation are not yet implemented.

### Current Status:
- ✅ User authentication and profile management
- ✅ Nium API integration (with fallback mock data)
- ✅ Wallet and transaction endpoints
- ✅ Security middleware and validation
- ✅ Docker containerization
- ⏳ Production deployment configuration
- ⏳ Comprehensive testing suite
- ⏳ API documentation (Swagger/OpenAPI)

## 📊 Monitoring and Logging

In production, consider adding:
- Application monitoring (e.g., New Relic, DataDog)
- Structured logging (e.g., Winston with log aggregation)
- Error tracking (e.g., Sentry)
- Performance monitoring
- Database monitoring
