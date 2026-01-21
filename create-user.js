const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('03v5h0u53', 10);
    
    const user = await prisma.user.create({
      data: {
        username: 'keli',
        email: 'kelib@gmail.com',
        passwordHash: hashedPassword,
        fullName: 'Keli',
        role: 'admin',
        isActive: true
      }
    });
    
    console.log('✅ Usuario creado exitosamente:', user);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
