const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const stats = await prisma.inventoryMovement.groupBy({
    by: ['movementType'],
    _sum: {
      quantity: true
    },
    _count: {
      id: true
    }
  });
  
  console.log('📊 RESUMEN DE MOVIMIENTOS:');
  console.log('='.repeat(60));
  
  stats.forEach(s => {
    const tipo = s.movementType === 'entrada' ? '📥 ENTRADAS' : '📤 SALIDAS';
    console.log(`${tipo}: ${s._count.id} movimientos | ${s._sum.quantity} unidades totales`);
  });
  
  const products = await prisma.product.findMany();
  const totalStock = products.reduce((sum, p) => sum + p.quantityInStock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * 4000 * p.quantityInStock), 0);
  
  console.log('='.repeat(60));
  console.log(`📦 PRODUCTOS: ${products.length} productos`);
  console.log(`📈 STOCK TOTAL: ${totalStock} unidades`);
  console.log(`💰 VALOR TOTAL: ${totalValue.toLocaleString('es-CO')} COP`);
  console.log('='.repeat(60));
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
