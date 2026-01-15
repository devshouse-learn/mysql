const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { username: 'admin' }
  });
  console.log('User:', user);
  process.exit(0);
}

main();
