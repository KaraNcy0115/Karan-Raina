const testSettings = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/settings');
    const data = await res.json();
    console.log('GET /api/settings:', data);

    const postRes = await fetch('http://localhost:3000/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Pin': 'KN2026'
      },
      body: JSON.stringify({
        songUrl: 'http://test.url/song.mp3'
      })
    });
    console.log('POST /api/settings status:', postRes.status);
    const postData = await postRes.json();
    console.log('POST /api/settings response:', postData);

    const res2 = await fetch('http://localhost:3000/api/settings');
    const data2 = await res2.json();
    console.log('GET /api/settings after POST:', data2);
  } catch (err) {
    console.error('Error:', err);
  }
};
testSettings();
