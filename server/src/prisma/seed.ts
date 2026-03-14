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

  const musicCategory = categories.find((c) => c.name === "Music");
  const techCategory = categories.find((c) => c.name === "Tech");
  const sportCategory = categories.find((c) => c.name === "Sport");

  if (!musicCategory || !techCategory || !sportCategory) {
    throw new Error("Missing categories after seed");
  }

  let venue = await prisma.venue.findFirst({
    where: {
      name: "Palais des Congrès",
      address: "1 Rue Exemple",
      city: "Paris",
    },
  });

  if (!venue) {
    venue = await prisma.venue.create({
      data: {
        id: uuidv4(),
        name: "Palais des Congrès",
        address: "1 Rue Exemple",
        city: "Paris",
      },
    });
  }

  await prisma.event.deleteMany({
    where: {
      title: {
        in: [
          "Concert Rock",
          "Festival Jazz",
          "Conférence Tech",
          "Atelier IA",
          "Meetup Dev",
          "Tournoi Sportif",
        ],
      },
    },
  });

  await prisma.event.createMany({
    data: [
      {
        id: uuidv4(),
        title: "Concert Rock",
        description: "Grand concert rock live.",
        startDate: new Date("2026-05-01T20:00:00.000Z"),
        capacity: 100,
        price: 25,
        organizerId: user.id,
        categoryId: musicCategory.id,
        venueId: venue.id,
      },
      {
        id: uuidv4(),
        title: "Festival Jazz",
        description: "Soirée jazz avec plusieurs artistes.",
        startDate: new Date("2026-05-02T19:00:00.000Z"),
        capacity: 200,
        price: 35,
        organizerId: user.id,
        categoryId: musicCategory.id,
        venueId: venue.id,
      },
      {
        id: uuidv4(),
        title: "Conférence Tech",
        description: "Conférence autour des nouvelles technologies.",
        startDate: new Date("2026-05-03T09:00:00.000Z"),
        capacity: 80,
        price: 0,
        organizerId: user.id,
        categoryId: techCategory.id,
        venueId: venue.id,
      },
      {
        id: uuidv4(),
        title: "Atelier IA",
        description: "Atelier découverte intelligence artificielle.",
        startDate: new Date("2026-05-04T14:00:00.000Z"),
        capacity: 40,
        price: 15,
        organizerId: user.id,
        categoryId: techCategory.id,
        venueId: venue.id,
      },
      {
        id: uuidv4(),
        title: "Meetup Dev",
        description: "Rencontre entre développeurs.",
        startDate: new Date("2026-05-05T18:30:00.000Z"),
        capacity: 60,
        price: 0,
        organizerId: user.id,
        categoryId: techCategory.id,
        venueId: venue.id,
      },
      {
        id: uuidv4(),
        title: "Tournoi Sportif",
        description: "Compétition sportive ouverte à tous.",
        startDate: new Date("2026-05-06T10:00:00.000Z"),
        capacity: 150,
        price: 10,
        organizerId: user.id,
        categoryId: sportCategory.id,
        venueId: venue.id,
      },
    ],
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