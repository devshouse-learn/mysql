const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🔍 Prueba de conexión a BD...');
    
    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    });
    
    console.log('✅ Conexión exitosa');
    console.log(`✅ Encontradas ${categories.length} categorías`);
    console.log(JSON.stringify(categories, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
