const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.count();
    const categories = await prisma.category.count();
    const products = await prisma.product.count();
    const movements = await prisma.inventoryMovement.count();
    
    console.log('📊 DATOS EN LA BASE DE DATOS:');
    console.log('✅ Usuarios:', users);
    console.log('✅ Categorías:', categories);
    console.log('✅ Productos:', products);
    console.log('✅ Movimientos:', movements);
    
    const prods = await prisma.product.findMany({ take: 3 });
    console.log('\n📦 Primeros 3 productos:');
    prods.forEach(p => console.log('  -', p.name, '(SKU:', p.sku + ')'));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
