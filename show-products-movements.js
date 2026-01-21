const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { 
      warehouse: true,
      category: true,
      inventoryMovements: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  
  console.log('='.repeat(80));
  console.log('PRODUCTOS CON SUS MOVIMIENTOS');
  console.log('='.repeat(80));
  
  products.forEach(p => {
    const precioUSD = p.price;
    const precioCOP = p.price * 4000;
    const valorTotal = precioCOP * p.quantityInStock;
    
    console.log(`\n📦 ${p.name} (SKU: ${p.sku})`);
    console.log(`   Categoría: ${p.category?.name || 'Sin categoría'}`);
    console.log(`   Bodega: ${p.warehouse?.name || 'Sin bodega'}`);
    console.log(`   Precio Unitario: $${precioUSD} USD = ${precioCOP.toLocaleString('es-CO')} COP`);
    console.log(`   Stock Actual: ${p.quantityInStock} unidades`);
    console.log(`   Valor Total Inventario: ${valorTotal.toLocaleString('es-CO')} COP`);
    console.log(`   Movimientos (${p.inventoryMovements.length} total):`);
    
    if (p.inventoryMovements.length === 0) {
      console.log(`      ❌ Sin movimientos registrados`);
    } else {
      p.inventoryMovements.forEach(m => {
        const fecha = new Date(m.createdAt).toLocaleDateString('es-ES');
        const tipo = m.movementType === 'entrada' ? '📥 ENTRADA' : '📤 SALIDA';
        console.log(`      ${tipo} | ${m.quantity} unidades | ${fecha} | ${m.notes || 'Sin notas'}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL DE PRODUCTOS: ${products.length}`);
  console.log('='.repeat(80));
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
