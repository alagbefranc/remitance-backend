const axios = require('axios');

const NIUM_CONFIG = {
  BASE_URL: 'https://gateway.nium.com/api/v1',
  API_KEY: 'OwPYnoAEkl5Hv4jJlSkpd6vus2vPpJ6Gh8RZINt8',
  CLIENT_HASH_ID: '258985e0-6a46-4416-914b-5f660b18fc95'
};

async function testAuthMethods() {
  console.log('🔐 Testing Different Nium Authentication Methods');
  console.log('===============================================');

  const customerData = {
    clientHashId: NIUM_CONFIG.CLIENT_HASH_ID,
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01',
    nationality: 'US',
    address: {
      addressLine1: '123 Test Street',
      city: 'New York', 
      state: 'NY',
      country: 'US',
      zipCode: '10001'
    }
  };

  // Method 1: x-api-key (we already tried this)
  console.log('1️⃣ Method 1: x-api-key header (already tested - failed)');

  // Method 2: Authorization Bearer
  console.log('\n2️⃣ Method 2: Authorization Bearer token...');
  try {
    const response = await axios.post(`${NIUM_CONFIG.BASE_URL}/customers`, customerData, {
      headers: {
        'Authorization': `Bearer ${NIUM_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Bearer token worked!', response.data);
  } catch (error) {
    console.log('❌ Bearer token failed:', error.response?.status, error.response?.data?.message);
  }

  // Method 3: Try with different content type
  console.log('\n3️⃣ Method 3: x-api-key with different content type...');
  try {
    const response = await axios.post(`${NIUM_CONFIG.BASE_URL}/customers`, customerData, {
      headers: {
        'x-api-key': NIUM_CONFIG.API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Different content type worked!', response.data);
  } catch (error) {
    console.log('❌ Different content type failed:', error.response?.status, error.response?.data?.message);
  }

  // Method 4: Try client-specific endpoint with proper path
  console.log('\n4️⃣ Method 4: Client-specific customer creation...');
  try {
    const response = await axios.post(`${NIUM_CONFIG.BASE_URL}/client/${NIUM_CONFIG.CLIENT_HASH_ID}/customer`, customerData, {
      headers: {
        'x-api-key': NIUM_CONFIG.API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Client-specific endpoint worked!', response.data);
  } catch (error) {
    console.log('❌ Client-specific endpoint failed:', error.response?.status, error.response?.data?.message);
  }

  // Method 5: Check if we need to authenticate first to get a session token
  console.log('\n5️⃣ Method 5: Check if we need session authentication...');
  try {
    // Try to get a session token first
    const authResponse = await axios.post(`${NIUM_CONFIG.BASE_URL}/auth`, {
      clientHashId: NIUM_CONFIG.CLIENT_HASH_ID,
      apiKey: NIUM_CONFIG.API_KEY
    });
    console.log('✅ Auth endpoint worked!', authResponse.data);
    
    // Now try customer creation with session token
    if (authResponse.data.token) {
      const customerResponse = await axios.post(`${NIUM_CONFIG.BASE_URL}/customers`, customerData, {
        headers: {
          'Authorization': `Bearer ${authResponse.data.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('✅ Customer creation with session token worked!', customerResponse.data);
    }
  } catch (error) {
    console.log('❌ Session auth failed:', error.response?.status, error.response?.data?.message);
  }

  // Method 6: Try minimal customer data (maybe we have too many fields)
  console.log('\n6️⃣ Method 6: Minimal customer data...');
  const minimalCustomerData = {
    firstName: 'Test',
    lastName: 'User',
    email: `minimal${Date.now()}@example.com`
  };
  
  try {
    const response = await axios.post(`${NIUM_CONFIG.BASE_URL}/customers`, minimalCustomerData, {
      headers: {
        'x-api-key': NIUM_CONFIG.API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Minimal data worked!', response.data);
  } catch (error) {
    console.log('❌ Minimal data failed:', error.response?.status, error.response?.data?.message);
  }
}

async function checkSupportedEndpoints() {
  console.log('\n🔍 Let\'s see what customer-related endpoints are available...');
  
  const testEndpoints = [
    '/customers',
    '/customer', 
    '/client/customers',
    '/client/customer',
    `/client/${NIUM_CONFIG.CLIENT_HASH_ID}/customers`,
    `/client/${NIUM_CONFIG.CLIENT_HASH_ID}/customer`
  ];

  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing GET ${endpoint}...`);
      const response = await axios.get(`${NIUM_CONFIG.BASE_URL}${endpoint}`, {
        headers: {
          'x-api-key': NIUM_CONFIG.API_KEY,
          'Accept': 'application/json'
        }
      });
      console.log(`✅ ${endpoint} exists:`, response.status);
    } catch (error) {
      const status = error.response?.status;
      if (status === 200 || status === 400) {
        console.log(`✅ ${endpoint} exists but might need different method/params:`, status);
      } else {
        console.log(`❌ ${endpoint} not available:`, status);
      }
    }
  }
}

async function runTest() {
  await testAuthMethods();
  await checkSupportedEndpoints();
  
  console.log('\n📋 Summary:');
  console.log('We need to find the correct authentication method and endpoint for customer creation.');
  console.log('The API key works for client details but might need different approach for customer creation.');
}

runTest().catch(console.error);
