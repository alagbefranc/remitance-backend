const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';

async function testWithRealNiumAPI() {
  console.log('🚀 Testing Backend with REAL Nium API Credentials');
  console.log('=' .repeat(60));

  try {
    // 1. Register a test user
    console.log('\n1️⃣ Creating test user...');
    const testUser = {
      email: `realtest${Date.now()}@example.com`,
      password: 'TestPass123',
      firstName: 'Real',
      lastName: 'User',
      phoneNumber: '+1 555 123 4567'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    authToken = registerResponse.data.data.tokens.accessToken;
    console.log('✅ User created:', registerResponse.data.data.user.email);

    // 2. Test Nium API connection
    console.log('\n2️⃣ Testing Nium API connection...');
    try {
      const niumTestResponse = await axios.get(`${BASE_URL}/api/wallet/test-nium-connection`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Nium API Connection SUCCESS!');
      console.log('📊 Client Info:');
      console.log('  - Client Name:', niumTestResponse.data.data.clientName || 'N/A');
      console.log('  - Status:', niumTestResponse.data.data.status || 'N/A');
      console.log('  - Region:', niumTestResponse.data.data.region || 'N/A');
      
      if (niumTestResponse.data.data.supportedCurrencies) {
        console.log('  - Supported Currencies:', niumTestResponse.data.data.supportedCurrencies.slice(0, 5).join(', '), '...');
      }
    } catch (error) {
      console.log('❌ Nium API Connection FAILED:');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data?.message);
      console.log('   Details:', JSON.stringify(error.response?.data, null, 2));
    }

    // 3. Test Exchange Rates (should work with real API)
    console.log('\n3️⃣ Testing real exchange rates...');
    try {
      const exchangeResponse = await axios.get(`${BASE_URL}/api/wallet/exchange-rates?from=USD&to=EUR`);
      console.log('✅ Exchange Rate USD->EUR:', exchangeResponse.data.data.exchangeRate);
      console.log('   Timestamp:', exchangeResponse.data.data.timestamp);
    } catch (error) {
      console.log('❌ Exchange Rate Failed:', error.response?.data?.message);
    }

    // 4. Try to create Nium customer (will attempt with real API)
    console.log('\n4️⃣ Testing Nium customer creation...');
    // User registration should have attempted to create Nium customer
    console.log('   Check user profile for niumCustomerHashId...');
    
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (profileResponse.data.data.niumCustomerHashId) {
      console.log('✅ Nium Customer Created:', profileResponse.data.data.niumCustomerHashId);
      
      // 5. Test getting wallets with real customer
      console.log('\n5️⃣ Testing real wallet retrieval...');
      try {
        const walletsResponse = await axios.get(`${BASE_URL}/api/wallet/wallets`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Wallets Retrieved:', walletsResponse.data.data.wallets?.length || 0, 'wallets');
        
        if (walletsResponse.data.data.wallets?.length > 0) {
          walletsResponse.data.data.wallets.forEach((wallet, i) => {
            console.log(`   Wallet ${i + 1}: ${wallet.currencyCode} - $${wallet.balance}`);
          });
        }
      } catch (error) {
        console.log('⚠️ Wallet retrieval failed:', error.response?.data?.message);
      }
      
    } else {
      console.log('⚠️ No Nium Customer Hash ID found - customer creation may have failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Real Nium API test completed');
}

testWithRealNiumAPI().catch(console.error);
