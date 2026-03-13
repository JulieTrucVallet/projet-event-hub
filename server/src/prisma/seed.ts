import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./client";

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "organizer@eventhub.com" },
    update: {
      firstname: "Organizer",
      lastname: "Demo",
      passwordHash,
      otpEnabled: false,
      otpSecret: null,
    },
    create: {
      id: uuidv4(),
      email: "organizer@eventhub.com",
      firstname: "Organizer",
      lastname: "Demo",
      passwordHash,
      otpEnabled: false,
      otpSecret: null,
    },
  });

  await prisma.category.createMany({
    data: ["Music", "Tech", "Sport"].map((name) => ({
      id: uuidv4(),
      name,
    })),
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany({
    where: { name: { in: ["Music", "Tech", "Sport"] } },
    select: { id: true, name: true },
  });

  const venue = await prisma.venue.create({
    data: {
      id: uuidv4(),
      name: "Palais des Congrès",
      address: "1 Rue Exemple",
      city: "Paris",
    },
  });

  console.log("✅ Seed done");
  console.log("USER_ID =", user.id);
  console.log("CATEGORY_IDS =", categories);
  console.log("VENUE_ID =", venue.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });