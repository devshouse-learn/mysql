const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Precios originales en USD
const originalPrices = {
  'Teclado Mecánico': { price: 120, cost: 70 },
  'Monitor LG 24"': { price: 250, cost: 150 },
  'Silla Ergonómica': { price: 350, cost: 180 },
  'Cable HDMI 5m': { price: 15, cost: 5 },
  'Escritorio Ejecutivo': { price: 450, cost: 250 },
  'Cuadernos Block': { price: 25, cost: 12 },
  'Bolígrafos Pack 10': { price: 8, cost: 3 },
  'Software Office': { price: 150, cost: 80 },
  'Pasta Térmica': { price: 12, cost: 4 },
  'Mouse Inalámbrico': { price: 30, cost: 15 },
  'WebCam HD': { price: 80, cost: 40 },
  'Audífonos Bluetooth': { price: 60, cost: 30 },
  'USB 32GB': { price: 20, cost: 8 },
  'Lámpara LED': { price: 35, cost: 18 },
  'Mouse Logitech MX': { price: 85, cost: 45 },
  'Laptop HP': { price: 800, cost: 500 },
  'Windows 11 Pro': { price: 199, cost: 100 }
};

async function resetAndConvertToCOP() {
  const products = await prisma.product.findMany();
  
  console.log('🔄 Restableciendo precios a USD y convirtiendo a COP...\n');
  
  for (const product of products) {
    const original = originalPrices[product.name];
    
    if (!original) {
      console.log(`⚠️  ${product.name} - No tiene precio original definido, omitiendo...`);
      continue;
    }
    
    const priceCOP = original.price * 4000;
    const costCOP = original.cost ? original.cost * 4000 : null;
    
    const updateData = { price: priceCOP.toString() };
    if (costCOP !== null) {
      updateData.cost = costCOP.toString();
    }
    
    await prisma.product.update({
      where: { id: product.id },
      data: updateData
    });
    
    console.log(`✅ ${product.name}`);
    console.log(`   Precio: $${original.price} USD → $${priceCOP.toLocaleString()} COP`);
    if (original.cost) {
      console.log(`   Costo: $${original.cost} USD → $${costCOP.toLocaleString()} COP`);
    }
    console.log(`   Stock: ${product.quantityInStock} unidades`);
    console.log(`   Valor Total Inventario: $${(priceCOP * product.quantityInStock).toLocaleString()} COP\n`);
  }
  
  console.log('✅ Conversión completada!');
  await prisma.$disconnect();
}

resetAndConvertToCOP().catch(console.error);
