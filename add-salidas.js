const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSalidas() {
  try {
    console.log('📤 Agregando movimientos de SALIDA...\n');
    
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (!adminUser) {
      throw new Error('No se encontró usuario admin');
    }
    
    // Obtener algunos productos para crear salidas de ejemplo
    const products = await prisma.product.findMany({
      where: { 
        status: 'active',
        quantityInStock: { gt: 0 }
      },
      take: 5,
      orderBy: { quantityInStock: 'desc' }
    });
    
    const salidas = [
      { product: products[0], quantity: 5, notes: 'Venta al cliente ABC' },
      { product: products[1], quantity: 3, notes: 'Pedido especial empresa XYZ' },
      { product: products[2], quantity: 2, notes: 'Venta mostrador' },
      { product: products[3], quantity: 1, notes: 'Salida por garantía' },
      { product: products[4], quantity: 4, notes: 'Transferencia entre bodegas' }
    ];
    
    let createdCount = 0;
    for (const salida of salidas) {
      if (salida.product) {
        await prisma.inventoryMovement.create({
          data: {
            productId: salida.product.id,
            movementType: 'salida',
            quantity: salida.quantity,
            referenceType: 'VENTA',
            referenceId: `VEN-2026-${String(createdCount + 1).padStart(4, '0')}`,
            notes: salida.notes,
            createdById: adminUser.id
          }
        });
        
        createdCount++;
        console.log(`✅ SALIDA ${createdCount}:`);
        console.log(`   Producto: ${salida.product.name}`);
        console.log(`   Cantidad: ${salida.quantity} unidades`);
        console.log(`   Notas: ${salida.notes}`);
        console.log(`   Referencia: VEN-2026-${String(createdCount).padStart(4, '0')}\n`);
      }
    }
    
    console.log(`\n✨ Total de salidas creadas: ${createdCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addSalidas();
