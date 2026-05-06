const fetch = require('node-fetch'); // or use global fetch if node version supports it
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "UNDEFINED");

const modelsToTry = [
  { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, name: "gemini-2.5-flash (v1beta)" },
  { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, name: "gemini-1.5-flash (v1beta)" },
  { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, name: "gemini-flash-latest (v1beta)" },
  { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`, name: "gemini-1.5-flash-latest (v1beta)" },
  { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`, name: "gemini-1.5-flash (v1)" },
  { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`, name: "gemini-1.5-pro (v1beta)" }
];

async function testAll() {
  for (const m of modelsToTry) {
    try {
      console.log(`\nTesting: ${m.name}...`);
      const response = await fetch(`${m.url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        })
      });
      console.log("Status:", response.status);
      const text = await response.text();
      console.log("Response:", text.substring(0, 300));
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
}

testAll();
