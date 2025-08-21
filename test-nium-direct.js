const axios = require('axios');

// Your Nium credentials
const NIUM_API_URL = 'https://gateway.nium.com/api/v1';
const NIUM_API_KEY = 'OwPYnoAEkl5Hv4jJlSkpd6vus2vPpJ6Gh8RZINt8';
const NIUM_CLIENT_HASH_ID = '258985e0-6a46-4416-914b-5f660b18fc95';

async function testNiumDirectly() {
    console.log('🔍 Testing Nium API directly...');
    console.log('Base URL:', NIUM_API_URL);
    console.log('Client ID:', NIUM_CLIENT_HASH_ID);
    console.log('API Key (first 10):', NIUM_API_KEY.substring(0, 10));
    console.log('');

    // Test 1: Simple GET request to client endpoint
    try {
        console.log('🧪 Test 1: GET /client/{clientHashId}');
        const response = await axios({
            method: 'GET',
            url: `${NIUM_API_URL}/client/${NIUM_CLIENT_HASH_ID}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': NIUM_API_KEY
            },
            timeout: 15000
        });
        
        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Error:');
        console.log('Status:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
        console.log('Full URL:', error.config?.url);
        console.log('Headers sent:', JSON.stringify(error.config?.headers, null, 2));
    }

    console.log('\n' + '='.repeat(50));

    // Test 2: Try exchange rates endpoint (often works without authentication)
    try {
        console.log('🧪 Test 2: GET /exchange-rates');
        const response = await axios({
            method: 'GET',
            url: `${NIUM_API_URL}/exchange-rates`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': NIUM_API_KEY
            },
            params: {
                sourceCurrencyCode: 'USD',
                destinationCurrencyCode: 'EUR'
            },
            timeout: 15000
        });
        
        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Error:');
        console.log('Status:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }

    console.log('\n' + '='.repeat(50));

    // Test 3: Try different API versions
    try {
        console.log('🧪 Test 3: GET /client/{clientHashId} with API v4');
        const response = await axios({
            method: 'GET',
            url: `https://gateway.nium.com/api/v4/client/${NIUM_CLIENT_HASH_ID}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': NIUM_API_KEY
            },
            timeout: 15000
        });
        
        console.log('✅ Success!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Error:');
        console.log('Status:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testNiumDirectly().catch(console.error);
