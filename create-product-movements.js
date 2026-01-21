const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createProductMovements() {
  console.log('📦 Creando movimientos para todos los productos...\n');
  
  // Obtener todos los productos con sus movimientos
  const products = await prisma.product.findMany({
    include: {
      inventoryMovements: true,
      warehouse: true,
      category: true
    }
  });

  // Obtener usuarios para asignar a los movimientos
  const users = await prisma.user.findMany();
  const adminUser = users.find(u => u.role === 'admin') || users[0];

  let createdCount = 0;
  let existingCount = 0;

  for (const product of products) {
    if (product.inventoryMovements.length === 0) {
      // Producto sin movimientos - crear entrada inicial
      const movement = await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          movementType: 'entrada',
          quantity: product.quantityInStock,
          notes: `Inventario inicial - ${product.name}`,
          createdById: adminUser.id
        }
      });

      console.log(`✅ Creado movimiento inicial para: ${product.name}`);
      console.log(`   Tipo: Entrada`);
      console.log(`   Cantidad: ${product.quantityInStock} unidades`);
      console.log(`   Bodega: ${product.warehouse?.name || 'Sin asignar'}`);
      console.log(`   Fecha: ${movement.createdAt.toLocaleDateString()}\n`);
      createdCount++;
    } else {
      // Verificar si los movimientos suman correctamente
      const totalEntries = product.inventoryMovements
        .filter(m => m.movementType === 'entrada')
        .reduce((sum, m) => sum + m.quantity, 0);
      
      const totalExits = product.inventoryMovements
        .filter(m => m.movementType === 'salida')
        .reduce((sum, m) => sum + m.quantity, 0);

      const calculatedStock = totalEntries - totalExits;
      const actualStock = product.quantityInStock;

      if (calculatedStock !== actualStock) {
        // Crear ajuste para cuadrar el inventario
        const adjustment = actualStock - calculatedStock;
        const movementType = adjustment > 0 ? 'entrada' : 'salida';
        const adjustmentQty = Math.abs(adjustment);
        
        await prisma.inventoryMovement.create({
          data: {
            productId: product.id,
            movementType: movementType,
            quantity: adjustmentQty,
            notes: `Ajuste de inventario - Diferencia: ${adjustment > 0 ? '+' : '-'}${adjustmentQty}`,
            createdById: adminUser.id
          }
        });

        console.log(`🔧 Ajuste creado para: ${product.name}`);
        console.log(`   Stock calculado: ${calculatedStock}`);
        console.log(`   Stock actual: ${actualStock}`);
        console.log(`   Ajuste: ${movementType} de ${adjustmentQty} unidades\n`);
        createdCount++;
      } else {
        console.log(`✓ ${product.name} - Ya tiene movimientos correctos (${product.inventoryMovements.length} movimientos)`);
        existingCount++;
      }
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('📊 RESUMEN:');
  console.log(`✅ Movimientos creados: ${createdCount}`);
  console.log(`✓  Productos con movimientos existentes: ${existingCount}`);
  console.log(`📦 Total productos procesados: ${products.length}`);
  console.log('═══════════════════════════════════════\n');

  // Mostrar resumen de movimientos por producto
  console.log('📋 RESUMEN DE MOVIMIENTOS POR PRODUCTO:\n');
  
  const productsWithMovements = await prisma.product.findMany({
    include: {
      inventoryMovements: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  for (const product of productsWithMovements) {
    const entries = product.inventoryMovements.filter(m => m.movementType === 'entrada').length;
    const exits = product.inventoryMovements.filter(m => m.movementType === 'salida').length;
    
    console.log(`📦 ${product.name} (Stock: ${product.quantityInStock})`);
    console.log(`   Movimientos: ${product.inventoryMovements.length} total`);
    console.log(`   📥 Entradas: ${entries} | 📤 Salidas: ${exits}`);
    console.log('');
  }

  await prisma.$disconnect();
}

createProductMovements().catch(console.error);
