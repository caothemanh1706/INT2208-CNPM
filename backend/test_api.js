const jwt = require('jsonwebtoken');

const JWT_SECRET = 'default-secret-key-for-dev';
const userId = 6;
const email = 'manhcao17@gmail.com';

const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
console.log('Generated token:', token);

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/statistics/overview', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Status code:', res.status);
    const json = await res.json();
    console.log('Response body:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

run();
