require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !key) {
  console.error("ERROR: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in the .env file.");
  process.exit(1);
}

const url = `${supabaseUrl}/rest/v1/member`;
async function testCols() {
  const attempt = {
    // try camelCase mapping
    memberID: 'LF-TEST-1',
    firstName: 'Test',
    lastName: 'User',
    gender: 'male',
    age: 30,
    email: 'test@example.com',
    phone: '123',
    street: '123 st',
    city: 'city',
    country: 'country'
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(attempt)
  });
  
  const data = await res.json();
  console.log("Response:", data);
}

testCols();
