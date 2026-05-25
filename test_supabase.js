require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !key) {
  console.error("ERROR: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in the .env file.");
  process.exit(1);
}

const url = `${supabaseUrl}/rest/v1/member`;
fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    member_id: 'LF-TEST-' + Math.floor(Math.random() * 1000),
    first_name: 'Test',
    last_name: 'User',
    gender: 'male',
    age: 30,
    email: 'test@example.com',
    phone: '1234567890',
    street: '123 Test St',
    city: 'Test City',
    country: 'Test Country'
  })
})
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(result => {
    console.log("STATUS CODE:", result.status);
    console.log("RESPONSE:", JSON.stringify(result.data, null, 2));
  })
  .catch(console.error);
