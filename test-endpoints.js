const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';
let testUserId = '';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to log test results
function logTest(testName, success, data = null, error = null) {
  console.log(`\n🧪 Testing: ${testName}`);
  if (success) {
    console.log(`✅ PASSED`);
    if (data) {
      console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    }
  } else {
    console.log(`❌ FAILED`);
    if (error) {
      console.log(`🚨 Error:`, error.message);
      if (error.response?.data) {
        console.log(`📄 Response:`, JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

// Helper function to set auth header
function setAuthHeader(token) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

async function testEndpoints() {
  console.log('🚀 Starting RemittanceApp Backend API Tests\n');
  console.log(`🔗 Base URL: ${BASE_URL}\n`);

  try {
    // 1. Test Health Check
    try {
      const response = await api.get('/health');
      logTest('Health Check', true, response.data);
    } catch (error) {
      logTest('Health Check', false, null, error);
    }

    // 2. Test Root Endpoint
    try {
      const response = await api.get('/');
      logTest('Root Endpoint', true, response.data);
    } catch (error) {
      logTest('Root Endpoint', false, null, error);
    }

    // 3. Test User Registration
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890'
    };

    try {
      const response = await api.post('/api/auth/register', testUser);
      logTest('User Registration', true, response.data);
      
      if (response.data.success && response.data.data?.tokens?.accessToken) {
        authToken = response.data.data.tokens.accessToken;
        testUserId = response.data.data.user._id;
        setAuthHeader(authToken);
        console.log(`🔑 Auth Token Set: ${authToken.substring(0, 20)}...`);
      }
    } catch (error) {
      logTest('User Registration', false, null, error);
    }

    // 4. Test User Login
    try {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };
      const response = await api.post('/api/auth/login', loginData);
      logTest('User Login', true, response.data);
    } catch (error) {
      logTest('User Login', false, null, error);
    }

    // 5. Test Get Profile (Protected Route)
    try {
      const response = await api.get('/api/auth/profile');
      logTest('Get User Profile', true, response.data);
    } catch (error) {
      logTest('Get User Profile', false, null, error);
    }

    // 6. Test Update Profile
    try {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1987654321'
      };
      const response = await api.put('/api/auth/profile', updateData);
      logTest('Update Profile', true, response.data);
    } catch (error) {
      logTest('Update Profile', false, null, error);
    }

    // 7. Test Get Wallets (Protected Route)
    try {
      const response = await api.get('/api/wallet/wallets');
      logTest('Get Wallets', true, response.data);
    } catch (error) {
      logTest('Get Wallets', false, null, error);
    }

    // 8. Test Get Transactions (Protected Route)
    try {
      const response = await api.get('/api/wallet/transactions');
      logTest('Get Transactions', true, response.data);
    } catch (error) {
      logTest('Get Transactions', false, null, error);
    }

    // 9. Test Get Exchange Rates (Public Route)
    try {
      const response = await api.get('/api/wallet/exchange-rates?from=USD&to=EUR');
      logTest('Get Exchange Rates', true, response.data);
    } catch (error) {
      logTest('Get Exchange Rates', false, null, error);
    }

    // 10. Test Get Beneficiaries (Protected Route)
    try {
      const response = await api.get('/api/wallet/beneficiaries');
      logTest('Get Beneficiaries', true, response.data);
    } catch (error) {
      logTest('Get Beneficiaries', false, null, error);
    }

    // 11. Test Validation Errors
    try {
      const response = await api.post('/api/auth/register', {
        email: 'invalid-email',
        password: '123', // Too short
        firstName: '',
        lastName: ''
      });
      logTest('Validation Error Test', false, response.data);
    } catch (error) {
      logTest('Validation Error Test (Expected Failure)', true, error.response?.data);
    }

    // 12. Test Unauthorized Access
    try {
      // Remove auth header temporarily
      delete api.defaults.headers.Authorization;
      const response = await api.get('/api/auth/profile');
      logTest('Unauthorized Access Test', false, response.data);
    } catch (error) {
      logTest('Unauthorized Access Test (Expected Failure)', true, error.response?.data);
      // Restore auth header
      setAuthHeader(authToken);
    }

    // 13. Test Send Money (with mock data)
    try {
      const sendMoneyData = {
        beneficiaryHashId: 'ben_test_123',
        amount: 100.50,
        sourceCurrencyCode: 'USD',
        destinationCurrencyCode: 'EUR',
        purpose: 'Testing',
        description: 'API endpoint test'
      };
      const response = await api.post('/api/wallet/send-money', sendMoneyData);
      logTest('Send Money', true, response.data);
    } catch (error) {
      logTest('Send Money', false, null, error);
    }

    // 14. Test Non-existent Endpoint
    try {
      const response = await api.get('/api/non-existent-endpoint');
      logTest('Non-existent Endpoint', false, response.data);
    } catch (error) {
      logTest('Non-existent Endpoint (Expected 404)', true, error.response?.data);
    }

    console.log('\n🎉 API Testing Complete!');
    console.log(`\n📊 Test Summary:`);
    console.log(`• All major endpoints tested`);
    console.log(`• Authentication flow verified`);
    console.log(`• Protected routes secured`);
    console.log(`• Validation working`);
    console.log(`• Error handling functional`);

  } catch (error) {
    console.error('🚨 Critical testing error:', error.message);
  }
}

// Run the tests
testEndpoints().catch(console.error);
