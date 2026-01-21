const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetMovements() {
  try {
    console.log('🔄 Reiniciando movimientos de inventario...\n');
    
    // 1. Obtener el usuario admin para los movimientos
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (!adminUser) {
      throw new Error('No se encontró usuario admin');
    }
    
    // 2. Eliminar TODOS los movimientos de entrada
    const deletedEntradas = await prisma.inventoryMovement.deleteMany({
      where: { movementType: 'entrada' }
    });
    console.log(`❌ Eliminados ${deletedEntradas.count} movimientos de ENTRADA\n`);
    
    // 3. Obtener todos los productos activos
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' }
    });
    
    console.log(`📦 Creando movimientos de entrada para ${products.length} productos:\n`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // 4. Crear movimiento de entrada para cada producto
    let createdCount = 0;
    for (const product of products) {
      if (product.quantityInStock > 0) {
        await prisma.inventoryMovement.create({
          data: {
            productId: product.id,
            movementType: 'entrada',
            quantity: product.quantityInStock,
            referenceType: 'INVENTARIO_INICIAL',
            referenceId: `INV-2026-${String(product.id).padStart(4, '0')}`,
            notes: `Entrada inicial de inventario - Stock: ${product.quantityInStock} unidades`,
            createdById: adminUser.id
          }
        });
        
        createdCount++;
        console.log(`✅ ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Precio: $${parseFloat(product.price).toLocaleString()} COP`);
        if (product.cost) {
          console.log(`   Costo: $${parseFloat(product.cost).toLocaleString()} COP`);
        } else {
          console.log(`   Costo: NO DEFINIDO`);
        }
        console.log(`   Cantidad entrada: ${product.quantityInStock} unidades`);
        console.log(`   Referencia: INV-2026-${String(product.id).padStart(4, '0')}\n`);
      } else {
        console.log(`⚠️  ${product.name} - Sin stock, no se crea movimiento\n`);
      }
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\n✨ Proceso completado:`);
    console.log(`   - Movimientos eliminados: ${deletedEntradas.count}`);
    console.log(`   - Movimientos creados: ${createdCount}`);
    console.log(`   - Productos procesados: ${products.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetMovements();
