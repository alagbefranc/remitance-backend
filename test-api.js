const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';

async function testAPI() {
  console.log('🚀 Testing RemittanceApp Backend API\n');

  try {
    // 1. Test Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);

    // 2. Test Root Endpoint
    console.log('\n2️⃣ Testing Root Endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root Endpoint:', rootResponse.data);

    // 3. Test User Registration
    console.log('\n3️⃣ Testing User Registration...');
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1 234 567 8900'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Registration Success:', registerResponse.data);
    
    if (registerResponse.data.data?.tokens?.accessToken) {
      authToken = registerResponse.data.data.tokens.accessToken;
      console.log('🔑 Auth token obtained');
    }

    // 4. Test User Login
    console.log('\n4️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login Success:', loginResponse.data);

    // 5. Test Protected Route - Get Profile
    console.log('\n5️⃣ Testing Get Profile (Protected)...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile Retrieved:', profileResponse.data);

    // 6. Test Get Exchange Rates (Public)
    console.log('\n6️⃣ Testing Exchange Rates (Public)...');
    const exchangeResponse = await axios.get(`${BASE_URL}/api/wallet/exchange-rates?from=USD&to=EUR`);
    console.log('✅ Exchange Rates:', exchangeResponse.data);

    // 7. Test Get Wallets (Protected)
    console.log('\n7️⃣ Testing Get Wallets (Protected)...');
    const walletsResponse = await axios.get(`${BASE_URL}/api/wallet/wallets`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Wallets Retrieved:', walletsResponse.data);

    // 8. Test Get Transactions (Protected)
    console.log('\n8️⃣ Testing Get Transactions (Protected)...');
    const transactionsResponse = await axios.get(`${BASE_URL}/api/wallet/transactions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Transactions Retrieved:', transactionsResponse.data);

    console.log('\n🎉 All API endpoints are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
