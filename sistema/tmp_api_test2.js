const http = require('http');
const options = { hostname: 'localhost', port: 4000, path: '/api/questoes', method: 'GET' };
const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(data);
    process.exit(0);
  });
});
req.on('error', err => { console.error(err); process.exit(1); });
req.end();
