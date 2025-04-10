const http = require('http');
const https = require('https');

// Configuration
const apiUrl = process.env.API_URL || 'http://localhost:8000'; // Replace with your API URL
const endpoints = [
  '/menu',
  '/menu/1', // Replace with a valid ID if needed
];

// Function to make an HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    console.log(`Testing connection to: ${url}`);
    
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = client.get(url, (res) => {
      let data = '';
      
      // Get the response data
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process the complete response
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          url,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          responseTime,
          dataSize: data.length,
          // Include a small preview of data if it's not too large
          dataPreview: data.length < 500 ? data : data.substring(0, 500) + '...'
        });
      });
    });
    
    // Handle errors
    req.on('error', (error) => {
      reject({
        url,
        error: error.message
      });
    });
    
    // Set timeout
    req.setTimeout(10000, () => {
      req.abort();
      reject({
        url,
        error: 'Request timed out after 10 seconds'
      });
    });
  });
}

// Run tests for all endpoints
async function testApiConnections() {
  console.log('API Connection Test');
  console.log('==================');
  console.log(`Base URL: ${apiUrl}`);
  console.log('');
  
  // Test DNS resolution
  console.log('Testing DNS resolution...');
  const hostname = new URL(apiUrl).hostname;
  const dns = require('dns');
  
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.lookup(hostname, { all: true }, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
    
    console.log(`DNS resolution successful for ${hostname}:`);
    addresses.forEach(addr => {
      console.log(`- ${addr.address} (${addr.family === 4 ? 'IPv4' : 'IPv6'})`);
    });
  } catch (error) {
    console.error(`DNS resolution failed for ${hostname}:`, error.message);
  }
  
  console.log('\nTesting API endpoints:');
  
  // Process each endpoint sequentially
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${apiUrl}${endpoint}`);
      console.log(`\n✅ Endpoint: ${endpoint}`);
      console.log(`   Status: ${result.statusCode} ${result.statusMessage}`);
      console.log(`   Response time: ${result.responseTime}ms`);
      console.log(`   Data size: ${result.dataSize} bytes`);
      console.log(`   Content type: ${result.headers['content-type'] || 'Not specified'}`);
      
      if (result.statusCode >= 200 && result.statusCode < 300) {
        console.log('   Data preview:');
        console.log(`   ${result.dataPreview.replace(/\n/g, '\n   ')}`);
      }
    } catch (error) {
      console.log(`\n❌ Endpoint: ${endpoint}`);
      console.log(`   Error: ${error.error}`);
    }
  }
}

// Run the tests
testApiConnections().catch(console.error); 