const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearAttempts() {
  const result = await prisma.attempt.deleteMany({});
  console.log(`Cleared ${result.count} attempts so you can replay the quiz!`);
}

clearAttempts().catch(console.error).finally(() => prisma.$disconnect());
