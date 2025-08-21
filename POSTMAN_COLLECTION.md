# RemittanceApp API - Postman Collection

This directory contains a comprehensive Postman collection for testing the RemittanceApp backend API.

## 📁 Files

- **`RemittanceApp-API.postman_collection.json`** - Complete API collection with all endpoints
- **`RemittanceApp-Environments.postman_environment.json`** - Environment variables for different deployment environments  
- **`POSTMAN_COLLECTION.md`** - This documentation file

## 🚀 Quick Start

### 1. Import Collection
1. Open Postman
2. Click **Import** button
3. Select **`RemittanceApp-API.postman_collection.json`**
4. The collection will be imported with all requests organized in folders

### 2. Import Environment  
1. In Postman, go to **Environments** tab
2. Click **Import**
3. Select **`RemittanceApp-Environments.postman_environment.json`**
4. Select the **RemittanceApp Environments** environment

### 3. Set Base URL
- The collection is pre-configured for `http://localhost:3001`
- To test against a different environment, update the `baseUrl` variable

## 📋 Collection Structure

### 🏥 Health & Info
- **Health Check** - `GET /health` - Check server status
- **API Info** - `GET /` - Get available endpoints

### 🔐 Authentication  
- **Register User** - `POST /api/auth/register` - Create new user account
- **Login User** - `POST /api/auth/login` - Authenticate user
- **Get User Profile** - `GET /api/auth/profile` - Get current user data  
- **Update User Profile** - `PUT /api/auth/profile` - Update user information

### 💼 Wallet Operations
- **Get User Wallets** - `GET /api/wallet/wallets` - List all user wallets
- **Get All Transactions** - `GET /api/wallet/transactions` - Get transaction history
- **Get Wallet Transactions** - `GET /api/wallet/transactions/{walletId}` - Wallet-specific transactions
- **Get Beneficiaries** - `GET /api/wallet/beneficiaries` - List saved beneficiaries

### 💱 Exchange Rates
- **Get Exchange Rate USD to EUR** - `GET /api/wallet/exchange-rates?from=USD&to=EUR`
- **Get Exchange Rate USD to CAD** - `GET /api/wallet/exchange-rates?from=USD&to=CAD`
- **Get Exchange Rate GBP to USD** - `GET /api/wallet/exchange-rates?from=GBP&to=USD`

### 💸 Money Transfer
- **Send Money** - `POST /api/wallet/send-money` - Initiate money transfer

### 🔧 Debug & Testing
- **Test Nium Connection** - `GET /api/wallet/test-nium-connection` - Test Nium API connectivity
- **Debug Configuration** - `GET /api/wallet/debug-config` - View current API configuration

### ❌ Error Testing
- **Invalid Login** - Test authentication failure
- **Unauthorized Access** - Test protected route without token
- **Invalid Exchange Rate** - Test validation errors
- **Invalid Registration** - Test input validation
- **Non-existent Endpoint** - Test 404 handling

## 🔄 Automated Token Management

The collection includes automated scripts that:
- **Automatically save JWT tokens** after successful login/registration
- **Set authorization headers** for protected routes
- **Run basic response validation** on all requests
- **Log request/response information** to console

## 🧪 Testing Flow

### Basic Flow
1. **Start your backend server** (`npm run dev`)
2. Run **"Register User"** request
   - Creates a new user and automatically saves the auth token
3. Test **"Get User Profile"** to verify authentication
4. Test wallet operations, exchange rates, etc.

### Complete Test Flow
1. **Health Check** - Verify server is running
2. **Register User** - Create test account
3. **Login User** - Test authentication  
4. **Get User Profile** - Verify token works
5. **Update Profile** - Test profile updates
6. **Get Wallets** - Test Nium integration
7. **Get Exchange Rates** - Test public endpoints
8. **Error Testing** - Validate error handling

## 🌍 Environment Variables

The collection uses these variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | API server URL | `http://localhost:3001` |
| `authToken` | JWT token (auto-set) | `""` |
| `testEmail` | Test user email | `john.doe@example.com` |
| `testPassword` | Test password | `SecurePass123` |
| `environment` | Current env | `development` |

## 🔧 Environment Setup

### Development
```json
{
  "baseUrl": "http://localhost:3001",
  "environment": "development"
}
```

### Staging
```json
{
  "baseUrl": "https://api-staging.yourapp.com",
  "environment": "staging"  
}
```

### Production
```json
{
  "baseUrl": "https://api.yourapp.com",
  "environment": "production"
}
```

## 📊 Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "message": "string",
  "data": any,
  "error": "string (optional)"
}
```

## 🚨 Common Issues

### Authentication Errors
- Make sure to **Register** or **Login** first to get an auth token
- Check that the `authToken` variable is set in your environment
- Verify the server is running on the correct port

### Connection Errors
- Ensure your backend server is running (`npm run dev`)
- Check the `baseUrl` environment variable
- Verify MongoDB is running (Docker container)

### Validation Errors
- Check request body format matches the examples
- Ensure required fields are provided
- Validate currency codes are 3-letter uppercase (USD, EUR, CAD)

## 🔍 Debugging

### Enable Postman Console
1. Go to **View** → **Show Postman Console**
2. Run requests to see detailed logs
3. Check for request/response data and errors

### Check Server Logs
- Monitor your backend server console for detailed error messages
- Look for Nium API integration logs

### Test Individual Endpoints
- Start with **Health Check** to verify connectivity
- Use **Debug Configuration** to check API settings
- Test **Register User** before trying protected routes

## 📝 Customization

### Adding New Requests
1. Right-click on appropriate folder
2. Select **Add Request**
3. Configure method, URL, headers, and body
4. Add tests and documentation

### Custom Test Scripts
Add to the **Tests** tab in requests:

```javascript
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("User has Nium customer ID", function () {
    const response = pm.response.json();
    pm.expect(response.data.niumCustomerHashId).to.exist;
});
```

### Environment-Specific Variables
- Create separate environments for dev/staging/prod
- Switch between environments using the dropdown
- Use `{{variable}}` syntax in requests

## 🤝 Team Usage

### Sharing Collection
1. Export the collection from Postman
2. Share the JSON files with team members
3. Document any environment-specific setup

### Workspace Setup
- Use Postman Team Workspaces for collaboration
- Share environments with team members
- Document test procedures and expected results

## 📚 API Documentation

For detailed API documentation, see:
- `README.md` - Backend documentation
- Server root endpoint - `GET /` - Lists all available endpoints
- Individual request descriptions in the collection

---

## ✅ Quick Test Checklist

- [ ] Import collection and environment
- [ ] Start backend server
- [ ] Test Health Check
- [ ] Register new user
- [ ] Login with user
- [ ] Get user profile
- [ ] Test wallet operations
- [ ] Test exchange rates
- [ ] Verify error handling

**Happy Testing!** 🎉
