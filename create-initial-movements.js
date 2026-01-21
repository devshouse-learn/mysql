const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Buscando productos con stock pero sin movimientos...\n');
  
  const products = await prisma.product.findMany({
    where: {
      quantityInStock: {
        gt: 0
      }
    },
    include: {
      inventoryMovements: true,
      warehouse: true
    }
  });

  let created = 0;
  let skipped = 0;

  for (const product of products) {
    if (product.inventoryMovements.length === 0) {
      // Crear movimiento de entrada inicial
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          movementType: 'entrada',
          quantity: product.quantityInStock,
          notes: `Inventario inicial - ${product.name}`,
          createdAt: new Date('2026-01-01') // Fecha anterior para que sea el movimiento inicial
        }
      });
      
      console.log(`✅ Creado movimiento de entrada para: ${product.name} (${product.quantityInStock} unidades)`);
      created++;
    } else {
      console.log(`⏭️  ${product.name} ya tiene movimientos registrados`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 RESUMEN:`);
  console.log(`   ✅ Movimientos creados: ${created}`);
  console.log(`   ⏭️  Productos saltados (ya tenían movimientos): ${skipped}`);
  console.log(`   📦 Total productos procesados: ${products.length}`);
  console.log('='.repeat(60));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
