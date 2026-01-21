const http = require('http');

function testEndpoint(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const count = Array.isArray(json) ? json.length : 'OK';
          console.log(`✅ ${name}: ${count} registros`);
          resolve(true);
        } catch (e) {
          console.log(`❌ ${name}: Error al parsear respuesta`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve(false);
    });
  });
}

async function testEndpoints() {
  console.log('🔍 Probando conexión al backend...\n');
  
  await testEndpoint('http://localhost:3000/api/categories', 'Categorías');
  await testEndpoint('http://localhost:3000/api/products', 'Productos');
  await testEndpoint('http://localhost:3000/api/warehouses', 'Bodegas');
  await testEndpoint('http://localhost:3000/api/inventory-movements', 'Movimientos');
  
  console.log('\n✅ Pruebas completadas');
}

testEndpoints();
