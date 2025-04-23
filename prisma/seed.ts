import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { phoneNumber: "+1234567890" },
    update: {},
    create: {
      username: "Alice Smith",
      phoneNumber: "+1234567890",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phoneNumber: "+0987654321" },
    update: {},
    create: {
      username: "Bob Johnson",
      phoneNumber: "+0987654321",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { phoneNumber: "+5556667777" },
    update: {},
    create: {
      username: "Charlie Brown",
      phoneNumber: "+5556667777",
    },
  });

  // Sample messages between Alice and Bob
  await prisma.message.createMany({
    data: [
      {
        content: "Hey Bob, how are you?",
        senderId: user1.id,
        receiverId: user2.id,
      },
      {
        content: "I'm good Alice! How about you?",
        senderId: user2.id,
        receiverId: user1.id,
      },
      {
        content: "Doing great! Want to meet for coffee tomorrow?",
        senderId: user1.id,
        receiverId: user2.id,
      },
      {
        content: "Sure, sounds good! What time?",
        senderId: user2.id,
        receiverId: user1.id,
      },
    ],
  });

  // Sample messages between Bob and Charlie
  await prisma.message.createMany({
    data: [
      {
        content: "Hi Charlie, did you finish the project?",
        senderId: user2.id,
        receiverId: user3.id,
      },
      {
        content: "Almost done! Just need to fix a few bugs",
        senderId: user3.id,
        receiverId: user2.id,
      },
      {
        content: "Great! Let me know if you need any help",
        senderId: user2.id,
        receiverId: user3.id,
      },
    ],
  });

  // Sample messages between Alice and Charlie
  await prisma.message.createMany({
    data: [
      {
        content: "Hey Charlie, are you coming to the party?",
        senderId: user1.id,
        receiverId: user3.id,
      },
      {
        content: "Yes, I'll be there! What should I bring?",
        senderId: user3.id,
        receiverId: user1.id,
      },
      {
        content: "Just bring yourself! See you there!",
        senderId: user1.id,
        receiverId: user3.id,
      },
    ],
  });

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
