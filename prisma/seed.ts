import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: "admin",
    password: "admin",
    profile: {
      create: {
        name: "Admin",
        gender: "MALE",
      },
    },
  },
];

async function main() {
  console.log("Start seeding ...");
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
  }
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
