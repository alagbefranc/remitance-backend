const axios = require('axios');

const NIUM_CONFIG = {
  BASE_URL: 'https://gateway.nium.com/api/v1',
  API_KEY: 'OwPYnoAEkl5Hv4jJlSkpd6vus2vPpJ6Gh8RZINt8',
  CLIENT_HASH_ID: '258985e0-6a46-4416-914b-5f660b18fc95'
};

async function createNiumCustomer() {
  console.log('🧪 Testing Nium Customer Creation');
  console.log('===============================');

  try {
    // Test different possible customer creation endpoints
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

    console.log('1️⃣ Trying POST /customers endpoint...');
    
    const headers = {
      'x-api-key': NIUM_CONFIG.API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-request-id': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    console.log('Headers:', headers);
    console.log('Customer Data:', JSON.stringify(customerData, null, 2));

    const response = await axios.post(`${NIUM_CONFIG.BASE_URL}/customers`, customerData, {
      headers: headers
    });

    console.log('✅ Customer created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Customer creation failed:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 400) {
      console.log('\n🔍 This might be a validation error. Let\'s check required fields...');
    } else if (error.response?.status === 403) {
      console.log('\n🔍 403 error - might need different endpoint or permissions');
    }

    // Try alternative endpoints
    console.log('\n2️⃣ Trying POST /client/{clientHashId}/customers endpoint...');
    
    try {
      const altResponse = await axios.post(`${NIUM_CONFIG.BASE_URL}/client/${NIUM_CONFIG.CLIENT_HASH_ID}/customers`, customerData, {
        headers: headers
      });
      
      console.log('✅ Alternative endpoint worked!');
      console.log('Response:', JSON.stringify(altResponse.data, null, 2));
      
    } catch (altError) {
      console.log('❌ Alternative endpoint also failed:');
      console.log('Status:', altError.response?.status);
      console.log('Error Data:', JSON.stringify(altError.response?.data, null, 2));
    }
  }
}

async function listAvailableEndpoints() {
  console.log('\n🔍 Let\'s check what endpoints are available...');
  
  try {
    // Try to get API documentation or available endpoints
    const response = await axios.get(`${NIUM_CONFIG.BASE_URL}/`, {
      headers: {
        'x-api-key': NIUM_CONFIG.API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('API Root Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Root endpoint not available');
  }
}

async function runTest() {
  await createNiumCustomer();
  await listAvailableEndpoints();
  
  console.log('\n💡 If customer creation failed, we may need to:');
  console.log('   1. Check Nium API documentation for exact endpoint');
  console.log('   2. Verify required fields and format');
  console.log('   3. Check if we need special permissions');
  console.log('   4. Use a different API version or path');
}

runTest().catch(console.error);
