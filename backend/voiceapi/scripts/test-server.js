/**
 * Simple test script to verify the server starts and responds correctly
 * Run this after starting the server to test basic functionality
 */

const http = require('http');

const SERVER_URL = 'http://localhost:3000';

// Test functions
async function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 && response.status === 'healthy') {
            resolve({ success: true, data: response });
          } else {
            resolve({ success: false, error: `Unexpected response: ${res.statusCode}` });
          }
        } catch (error) {
          resolve({ success: false, error: `Invalid JSON: ${error.message}` });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
  });
}

async function testRootEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 && response.name === 'Oto Voice API') {
            resolve({ success: true, data: response });
          } else {
            resolve({ success: false, error: `Unexpected response: ${res.statusCode}` });
          }
        } catch (error) {
          resolve({ success: false, error: `Invalid JSON: ${error.message}` });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
  });
}

async function testAuthRequiredEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/actions`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Should return 401 Unauthorized without auth headers
        if (res.statusCode === 401) {
          resolve({ success: true, message: 'Authentication properly required' });
        } else {
          resolve({ success: false, error: `Expected 401, got ${res.statusCode}` });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
  });
}

async function test404Endpoint() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/nonexistent`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 404) {
          resolve({ success: true, message: '404 handling works correctly' });
        } else {
          resolve({ success: false, error: `Expected 404, got ${res.statusCode}` });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
  });
}

// Main test function
async function runTests() {
  console.log('🧪 Testing Oto Voice API Server...\n');
  
  const tests = [
    { name: 'Health Endpoint', fn: testHealthEndpoint },
    { name: 'Root Endpoint', fn: testRootEndpoint },
    { name: 'Authentication Required', fn: testAuthRequiredEndpoint },
    { name: '404 Handling', fn: test404Endpoint }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    
    try {
      const result = await test.fn();
      
      if (result.success) {
        console.log('✅ PASS');
        if (result.data) {
          console.log(`   Response: ${JSON.stringify(result.data, null, 2)}`);
        } else if (result.message) {
          console.log(`   ${result.message}`);
        }
        passed++;
      } else {
        console.log('❌ FAIL');
        console.log(`   Error: ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log('❌ FAIL');
      console.log(`   Exception: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }
  
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! The server is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server configuration.');
  }
  
  return failed === 0;
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('🚀 Starting server tests...');
  console.log('⚠️  Make sure the server is running on localhost:3000\n');
  
  runTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
