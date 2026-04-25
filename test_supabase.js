const url = 'https://cmfutlhzjziecydqmerz.supabase.co/rest/v1/member';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZnV0bGh6anppZWN5ZHFtZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzgyODUsImV4cCI6MjA5MTcxNDI4NX0.bvduJBSMS_qVqy-CxLBg_z-UlIIpAMkUFR5u5qdf1oI';

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
