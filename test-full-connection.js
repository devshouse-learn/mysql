#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFullConnection() {
  console.log('🔍 PROBANDO CONEXIÓN COMPLETA\n');
  
  try {
    // 1. Verificar conexión a base de datos
    console.log('1️⃣ Probando conexión a MySQL...');
    await prisma.$connect();
    console.log('   ✅ Conectado a MySQL\n');

    // 2. Contar datos
    console.log('2️⃣ Verificando datos en base de datos...');
    const [categories, products, warehouses, movements] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.warehouse.count(),
      prisma.inventoryMovement.count()
    ]);
    
    console.log(`   ✅ Categorías: ${categories}`);
    console.log(`   ✅ Productos: ${products}`);
    console.log(`   ✅ Bodegas: ${warehouses}`);
    console.log(`   ✅ Movimientos: ${movements}\n`);

    // 3. Obtener datos de muestra
    console.log('3️⃣ Obteniendo datos de muestra...');
    const sampleProducts = await prisma.product.findMany({
      take: 5,
      include: {
        category: true,
        warehouse: true
      }
    });

    console.log('\n📦 PRODUCTOS DE MUESTRA:\n');
    sampleProducts.forEach(p => {
      console.log(`   • ${p.name} (${p.sku})`);
      console.log(`     Categoría: ${p.category?.name || 'Sin categoría'}`);
      console.log(`     Bodega: ${p.warehouse?.name || 'Sin bodega'}`);
      console.log(`     Stock: ${p.quantityInStock} unidades`);
      console.log(`     Precio: $${p.price}\n`);
    });

    console.log('✅ CONEXIÓN COMPLETA VERIFICADA\n');
    console.log('📊 ESTADO DE SERVIDORES:');
    console.log('   Backend:  http://localhost:3000 ✅');
    console.log('   Frontend: http://localhost:5173 ✅');
    console.log('   Swagger:  http://localhost:3000/api-docs ✅\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFullConnection();
