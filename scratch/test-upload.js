import fs from 'fs';

const testUpload = async () => {
  const fileContent = Buffer.from('hello world');
  fs.writeFileSync('scratch/test.txt', fileContent);
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const form = new FormData();
  form.append('file', blob, 'test.txt');

  try {
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: {
        'X-Admin-Pin': 'KN2026'
      },
      body: form
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (e) {
    console.error(e);
  }
};
testUpload();
