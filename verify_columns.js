const url = 'https://cmfutlhzjziecydqmerz.supabase.co/rest/v1/member';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZnV0bGh6anppZWN5ZHFtZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzgyODUsImV4cCI6MjA5MTcxNDI4NX0.bvduJBSMS_qVqy-CxLBg_z-UlIIpAMkUFR5u5qdf1oI';

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
