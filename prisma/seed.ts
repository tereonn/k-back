import { PrismaClient } from '@prisma/client';
import { UserRoles } from '../src/auth/types';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        code: UserRoles.User,
        name: 'User',
      },
      {
        code: UserRoles.Admin,
        name: 'Administrator',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
