const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testConfiguration() {
  console.log('🔧 Checking Backend Configuration...\n');

  try {
    // 1. Register a test user to get auth token
    const testUser = {
      email: `config${Date.now()}@example.com`,
      password: 'TestPass123',
      firstName: 'Config',
      lastName: 'Test',
      phoneNumber: '+1 555 999 8888'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    const authToken = registerResponse.data.data.tokens.accessToken;
    
    console.log('✅ Test user created for config check');

    // 2. Check debug configuration
    const configResponse = await axios.get(`${BASE_URL}/api/wallet/debug-config`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log('📊 Current Backend Configuration:');
    console.log('  - Nium API URL:', configResponse.data.data.niumApiUrl);
    console.log('  - API Key Configured:', configResponse.data.data.niumApiKeyConfigured);
    console.log('  - API Key (first 10):', configResponse.data.data.niumApiKeyFirst10);
    console.log('  - Client Hash ID:', configResponse.data.data.niumClientHashId);
    console.log('  - Environment:', configResponse.data.data.nodeEnv);

    // Expected values
    console.log('\n🎯 Expected Configuration:');
    console.log('  - Nium API URL: https://gateway.nium.com/api/v1');
    console.log('  - API Key (first 10): OwPYnoAEkl');
    console.log('  - Client Hash ID: 258985e0-6a46-4416-914b-5f660b18fc95');

    // Check if they match
    console.log('\n🔍 Configuration Check:');
    const urlCorrect = configResponse.data.data.niumApiUrl === 'https://gateway.nium.com/api/v1';
    const keyCorrect = configResponse.data.data.niumApiKeyFirst10 === 'OwPYnoAEkl';
    const clientCorrect = configResponse.data.data.niumClientHashId === '258985e0-6a46-4416-914b-5f660b18fc95';

    console.log('  - API URL:', urlCorrect ? '✅ CORRECT' : '❌ INCORRECT');
    console.log('  - API Key:', keyCorrect ? '✅ CORRECT' : '❌ INCORRECT');
    console.log('  - Client ID:', clientCorrect ? '✅ CORRECT' : '❌ INCORRECT');

    if (urlCorrect && keyCorrect && clientCorrect) {
      console.log('\n🎉 All configuration is correct!');
      console.log('The issue might be with the API request format or server restart needed.');
    } else {
      console.log('\n⚠️ Configuration mismatch detected!');
      console.log('Please check the .env file and restart the server.');
    }

  } catch (error) {
    console.error('❌ Configuration test failed:', error.response?.data || error.message);
  }
}

testConfiguration().catch(console.error);
