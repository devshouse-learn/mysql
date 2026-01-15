// prisma/seed.js
// Script para insertar datos de ejemplo en la base de datos

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // Crear usuario admin
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@inventory.local',
        passwordHash: '$2b$10$mwI.4Jblo1wjxCcSOXk8kOCcnrqA3xD6hDtaxis3knjrkCUJwv95O', // admin123 con bcrypt
        fullName: 'Administrador',
        role: 'admin',
        isActive: true
      }
    });
    console.log('✅ Usuario admin creado:', adminUser.username);

    // Crear categorías
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Electrónica' },
        update: {},
        create: { name: 'Electrónica', description: 'Productos electrónicos varios', isActive: true }
      }),
      prisma.category.upsert({
        where: { name: 'Muebles' },
        update: {},
        create: { name: 'Muebles', description: 'Muebles para oficina y hogar', isActive: true }
      }),
      prisma.category.upsert({
        where: { name: 'Accesorios' },
        update: {},
        create: { name: 'Accesorios', description: 'Accesorios y repuestos', isActive: true }
      }),
      prisma.category.upsert({
        where: { name: 'Software' },
        update: {},
        create: { name: 'Software', description: 'Licencias y software', isActive: true }
      }),
      prisma.category.upsert({
        where: { name: 'Consumibles' },
        update: {},
        create: { name: 'Consumibles', description: 'Artículos consumibles', isActive: true }
      })
    ]);
    console.log('✅ Categorías creadas:', categories.length);

    // Crear productos
    const products = await Promise.all([
      prisma.product.upsert({
        where: { sku: 'MON-LG-24-001' },
        update: {},
        create: {
          name: 'Monitor LG 24"',
          sku: 'MON-LG-24-001',
          description: 'Monitor FHD 24 pulgadas',
          price: 250.00,
          cost: 150.00,
          categoryId: categories[0].id,
          quantityInStock: 15,
          reorderLevel: 5,
          status: 'active',
          supplier: 'LG Electronics'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'KEY-MECH-001' },
        update: {},
        create: {
          name: 'Teclado Mecánico',
          sku: 'KEY-MECH-001',
          description: 'Teclado mecánico RGB',
          price: 120.00,
          cost: 70.00,
          categoryId: categories[0].id,
          quantityInStock: 8,
          reorderLevel: 3,
          status: 'active',
          supplier: 'Corsair'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'FURN-DESK-001' },
        update: {},
        create: {
          name: 'Escritorio Ejecutivo',
          sku: 'FURN-DESK-001',
          description: 'Escritorio de madera 1.5m',
          price: 450.00,
          cost: 250.00,
          categoryId: categories[1].id,
          quantityInStock: 5,
          reorderLevel: 2,
          status: 'active',
          supplier: 'MueblesPro'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'FURN-CHAIR-001' },
        update: {},
        create: {
          name: 'Silla Ergonómica',
          sku: 'FURN-CHAIR-001',
          description: 'Silla ergonómica con soporte lumbar',
          price: 350.00,
          cost: 180.00,
          categoryId: categories[1].id,
          quantityInStock: 10,
          reorderLevel: 3,
          status: 'active',
          supplier: 'MueblesPro'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'ACC-HDMI-5M' },
        update: {},
        create: {
          name: 'Cable HDMI 5m',
          sku: 'ACC-HDMI-5M',
          description: 'Cable HDMI de alta velocidad',
          price: 15.00,
          cost: 5.00,
          categoryId: categories[2].id,
          quantityInStock: 50,
          reorderLevel: 10,
          status: 'active',
          supplier: 'Generic'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'ACC-THERMAL-001' },
        update: {},
        create: {
          name: 'Pasta Térmica',
          sku: 'ACC-THERMAL-001',
          description: 'Pasta térmica premium',
          price: 12.00,
          cost: 4.00,
          categoryId: categories[2].id,
          quantityInStock: 30,
          reorderLevel: 10,
          status: 'active',
          supplier: 'Arctic'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'SW-WIN11-PRO' },
        update: {},
        create: {
          name: 'Windows 11 Pro',
          sku: 'SW-WIN11-PRO',
          description: 'Licencia Windows 11 Pro',
          price: 199.00,
          cost: 100.00,
          categoryId: categories[3].id,
          quantityInStock: 5,
          reorderLevel: 1,
          status: 'active',
          supplier: 'Microsoft'
        }
      }),
      prisma.product.upsert({
        where: { sku: 'CON-NOTEBOOK-A4' },
        update: {},
        create: {
          name: 'Cuadernos Block',
          sku: 'CON-NOTEBOOK-A4',
          description: 'Pack de 5 cuadernos A4',
          price: 25.00,
          cost: 12.00,
          categoryId: categories[4].id,
          quantityInStock: 100,
          reorderLevel: 20,
          status: 'active',
          supplier: 'Scribe'
        }
      })
    ]);
    console.log('✅ Productos creados:', products.length);

    // Crear un movimiento de inventario de ejemplo
    const movement = await prisma.inventoryMovement.create({
      data: {
        productId: products[0].id,
        movementType: 'entrada',
        quantity: 10,
        referenceType: 'PO',
        referenceId: 'PO-2024-001',
        notes: 'Entrada de compra inicial',
        createdById: adminUser.id
      }
    });
    console.log('✅ Movimiento de inventario creado');

    console.log('✨ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
