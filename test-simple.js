const http = require('http');

function testGET(path) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n✅ GET ${path}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(JSON.parse(data));
        resolve();
      });
    });
    req.on('error', (err) => {
      console.log(`\n❌ GET ${path}`);
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  await testGET('/api/categories');
  process.exit(0);
}

main();
