const fetch = require('node-fetch');

async function testAPI() {
  try {
    // GET todas las categorías
    console.log('\n📝 GET /api/categories');
    let res = await fetch('http://localhost:3000/api/categories');
    let data = await res.json();
    console.log(JSON.stringify(data, null, 2));

    if (data.data && data.data.length > 0) {
      const id = data.data[0].id;
      
      // GET por ID
      console.log(`\n📝 GET /api/categories/${id}`);
      res = await fetch(`http://localhost:3000/api/categories/${id}`);
      data = await res.json();
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
