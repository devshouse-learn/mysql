const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear una categoría de prueba
    const category = await prisma.category.create({
      data: {
        name: 'Electrónica',
        description: 'Productos electrónicos varios'
      }
    });

    console.log('✅ Categoría creada:', category);

    // Obtener todas las categorías
    const allCategories = await prisma.category.findMany({
      where: { deletedAt: null }
    });

    console.log('✅ Total de categorías:', allCategories.length);
    console.log(allCategories);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
