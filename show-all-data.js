const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showData() {
  try {
    const users = await prisma.user.count();
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany({ include: { category: true } });
    const warehouses = await prisma.warehouse.findMany();
    const movements = await prisma.inventoryMovement.count();
    
    console.log('\n🎉 DATOS CARGADOS EN EL BACKEND:\n');
    console.log('👥 USUARIOS:', users);
    console.log('   - admin (contraseña: admin123)');
    console.log('   - keli (contraseña: 03v5h0u53)\n');
    
    console.log('📂 CATEGORÍAS:', categories.length);
    categories.forEach(c => console.log('   -', c.name));
    
    console.log('\n🏪 BODEGAS:', warehouses.length);
    warehouses.forEach(w => console.log('   -', w.name, '-', w.location || ''));
    
    console.log('\n📦 PRODUCTOS:', products.length);
    products.forEach(p => {
      console.log('   -', p.sku, '|', p.name, '| Stock:', p.quantityInStock, '| Categoría:', p.category.name);
    });
    
    console.log('\n📊 MOVIMIENTOS DE INVENTARIO:', movements);
    console.log('\n✅ Recarga el frontend para ver todos los datos!\n');
  } finally {
    await prisma.$disconnect();
  }
}

showData();
