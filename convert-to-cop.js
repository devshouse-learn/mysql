const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function convertToCOP() {
  const products = await prisma.product.findMany();
  
  console.log('💱 Convirtiendo precios de USD a COP (1 USD = 4000 COP)...\n');
  
  for (const product of products) {
    const priceUSD = parseFloat(product.price);
    const costUSD = product.cost ? parseFloat(product.cost) : null;
    const priceCOP = priceUSD * 4000;
    const costCOP = costUSD ? costUSD * 4000 : null;
    
    const updateData = {
      price: priceCOP.toString()
    };
    
    if (costCOP !== null) {
      updateData.cost = costCOP.toString();
    }
    
    await prisma.product.update({
      where: { id: product.id },
      data: updateData
    });
    
    console.log(`✅ ${product.name}`);
    console.log(`   Precio: $${priceUSD} USD → $${priceCOP.toLocaleString()} COP`);
    if (costUSD) {
      console.log(`   Costo: $${costUSD} USD → $${costCOP.toLocaleString()} COP`);
    }
    console.log(`   Stock: ${product.quantityInStock} unidades`);
    console.log(`   Valor Total: $${(priceCOP * product.quantityInStock).toLocaleString()} COP\n`);
  }
  
  console.log('✅ Conversión completada!');
  await prisma.$disconnect();
}

convertToCOP().catch(console.error);
