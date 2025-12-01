/**
 * Test script to verify WordPress can reach Next.js webhook endpoint
 * Run this from your WordPress server or local machine to test connectivity
 */

const http = require('http');

const NEXTJS_URL = process.env.NEXTJS_URL || 'http://localhost:3000';
const NEXTJS_SECRET = process.env.NEXTJS_SECRET || 'nxjs_8k2m645445djasg855sdar889532fsdfs';

console.log('🧪 Testing webhook connection...');
console.log('📍 Target URL:', `${NEXTJS_URL}/api/revalidate`);
console.log('🔑 Secret:', NEXTJS_SECRET.substring(0, 10) + '...');
console.log('');

// Test POST request (like WordPress sends)
const postData = JSON.stringify({
  action: 'test',
  post_type: 'post',
  slug: 'test-post',
  post_id: 999,
});

const options = {
  hostname: NEXTJS_URL.replace(/^https?:\/\//, '').split(':')[0],
  port: NEXTJS_URL.includes(':') ? NEXTJS_URL.split(':').pop().replace(/\//g, '') : (NEXTJS_URL.startsWith('https') ? 443 : 80),
  path: '/api/revalidate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-secret': NEXTJS_SECRET,
    'Content-Length': Buffer.byteLength(postData),
  },
  timeout: 10000,
};

const req = http.request(options, (res) => {
  console.log(`✅ Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📦 Response Body:', data);
    try {
      const json = JSON.parse(data);
      console.log('✅ Parsed Response:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('⚠️ Response is not JSON');
    }
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS! Webhook endpoint is reachable and working!');
    } else {
      console.log(`\n⚠️ WARNING: Received status code ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ ERROR: Failed to connect to Next.js server');
  console.error('Error:', error.message);
  console.error('\n💡 Troubleshooting:');
  console.error('1. Make sure Next.js is running: npm run dev');
  console.error('2. If WordPress is in Docker, use host.docker.internal instead of localhost');
  console.error('3. If WordPress is on another machine, use the machine\'s IP address');
  console.error('4. Check firewall settings');
  console.error('5. Try using ngrok for local testing: ngrok http 3000');
});

req.on('timeout', () => {
  console.error('\n❌ ERROR: Request timed out');
  console.error('The Next.js server did not respond within 10 seconds');
  req.destroy();
});

req.write(postData);
req.end();

