const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`\n✅ ${method} ${path}`);
        console.log(`Status: ${res.statusCode}`);
        try {
          console.log(JSON.stringify(JSON.parse(body), null, 2));
        } catch {
          console.log(body);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`\n❌ Error: ${err.message}`);
      resolve();
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test() {
  console.log('🧪 PROBANDO CATEGORÍAS\n');

  // 1. GET todas
  await makeRequest('GET', '/api/categories');

  // 2. POST crear nueva
  await makeRequest('POST', '/api/categories', {
    name: 'Test ' + Date.now(),
    description: 'Categoría de prueba'
  });

  // 3. PUT actualizar
  await makeRequest('PUT', '/api/categories/1', {
    name: 'Electrónica Actualizada',
    description: 'Productos electrónicos'
  });

  process.exit(0);
}

test();
