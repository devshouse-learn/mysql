const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({
    where: { username: 'admin' }
  });
  console.log('Usuario admin eliminado');
  process.exit(0);
}

main();
