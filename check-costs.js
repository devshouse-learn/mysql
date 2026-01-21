const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProductCosts() {
  try {
    const products = await prisma.product.findMany({
      select: { 
        id: true, 
        name: true, 
        price: true, 
        cost: true, 
        quantityInStock: true 
      },
      orderBy: { name: 'asc' }
    });
    
    console.log('📊 PRODUCTOS Y SUS COSTOS:\n');
    console.log('═══════════════════════════════════════\n');
    
    const withCost = [];
    const withoutCost = [];
    
    products.forEach(p => {
      if (p.cost === null || p.cost === undefined) {
        withoutCost.push(p);
        console.log(`❌ ${p.name}`);
        console.log(`   Precio: $${parseFloat(p.price).toLocaleString()} COP`);
        console.log(`   Costo: NO DEFINIDO`);
        console.log(`   Stock: ${p.quantityInStock}\n`);
      } else {
        withCost.push(p);
        console.log(`✅ ${p.name}`);
        console.log(`   Precio: $${parseFloat(p.price).toLocaleString()} COP`);
        console.log(`   Costo: $${parseFloat(p.cost).toLocaleString()} COP`);
        const margin = ((parseFloat(p.price) - parseFloat(p.cost)) / parseFloat(p.price) * 100).toFixed(2);
        console.log(`   Margen: ${margin}%`);
        console.log(`   Stock: ${p.quantityInStock}\n`);
      }
    });
    
    console.log('\n═══════════════════════════════════════');
    console.log(`✅ Productos con costo definido: ${withCost.length}`);
    console.log(`❌ Productos sin costo: ${withoutCost.length}`);
    console.log('═══════════════════════════════════════');
    
    if (withoutCost.length > 0) {
      console.log('\n💡 RAZÓN:');
      console.log('Los productos sin costo se agregaron durante el seeding');
      console.log('inicial de la base de datos y no se les asignó costo.');
      console.log('En el script reset-and-convert.js solo se convirtieron');
      console.log('los productos que YA TENÍAN un costo definido.\n');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductCosts();
