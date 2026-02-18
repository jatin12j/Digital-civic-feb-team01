const axios = require('axios');
const API_URL = 'http://localhost:5001/api/auth';

const testAPI = async () => {
    try {
        console.log('--- STARTING API TEST ---');

        // 1. REGISTER A NEW USER
        const testUser = {
            name: 'API Tester',
            email: `api_test_${Date.now()}@example.com`,
            password: 'securePassword123',
            role: 'citizen',
            location: 'New York'
        };

        console.log(`\nTesting Registration: ${testUser.email}...`);
        const registerRes = await axios.post(`${API_URL}/register`, testUser);
        console.log('✅ Registration Successful!');

        // 2. LOGIN USER
        console.log('\nTesting Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login Successful!');
        const token = loginRes.data.token; // Assuming your response has a token field directly or in a cookie (need to check implementation)
        // Note: Since you're using httpOnly cookies, axios automatically handles them if configured, but here we're running node script.
        // Let's assume the controller returns a message or data.

        // 3. LOGOUT (Optional for this quick test)
        console.log('\nTesting Logout...');
        await axios.get(`${API_URL}/logout`);
        console.log('✅ Logout Successful!');

        console.log('\n--- ALL API TESTS PASSED! ---');

    } catch (error) {
        console.error('❌ API TEST FAILED!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testAPI();
