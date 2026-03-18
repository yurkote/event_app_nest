import { PrismaClient, EventType, Event, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type UserWithEvents = User & { createdEvents: Event[] };

async function main() {
  console.log('⏳ Починаємо сідування бази даних...');

  // 0. Очищення бази (важливо для уникнення конфліктів UUID при перезапуску)
  await prisma.participant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  //0.1. Створення адміна з admin@test.com - password123
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      fullName: 'Test Admin',
      passwordHash: await bcrypt.hash('password123', 10),
    },
  });
  console.log('⭐ Static admin created: admin@test.com / password123');

  // 1. Створюємо "Базових користувачів" (ті, що тільки зареєструвалися)
  const basicUsers = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          fullName: faker.person.fullName(),
          passwordHash,
        },
      }),
    ),
  );

  // 2. Створюємо "Організаторів" та їхні "Події" (Вкладеність 1)
  const activeUsers: UserWithEvents[] = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        passwordHash,
        createdEvents: {
          create: Array.from({
            length: faker.number.int({ min: 1, max: 3 }),
          }).map(() => ({
            title: faker.commerce.productName() + ' Meetup',
            description: faker.lorem.sentence(),
            eventDate: faker.date.future(),
            location: faker.location.city(),
            capacity: faker.number.int({ min: 10, max: 100 }),
            type: faker.helpers.arrayElement([
              EventType.PUBLIC,
              EventType.PRIVATE,
            ]),
          })),
        },
      },
      include: { createdEvents: true },
    });
    activeUsers.push(user);
  }

  console.log('✅ Користувачі та події створені');

  // 3. Створюємо "Учасників" (Вкладеність 2: зв'язок Many-to-Many)
  // Беремо всіх створених юзерів і випадковим чином підписуємо їх на випадкові події
  const allUsers = [...basicUsers, ...activeUsers];
  const allEvents = activeUsers.flatMap((u) => u.createdEvents);

  for (const event of allEvents) {
    // Вибираємо 2-4 випадкових людей для кожної події
    const randomParticipants = faker.helpers.arrayElements(allUsers, {
      min: 2,
      max: 4,
    });

    for (const participant of randomParticipants) {
      // Перевіряємо, щоб автор події не підписувався на власну подію (опціонально)
      if (participant.id !== event.creatorId) {
        await prisma.participant.create({
          data: {
            userId: participant.id,
            eventId: event.id,
            joinedAt: faker.date.recent(),
          },
        });
      }
    }
  }

  console.log('🚀 Сідування завершено успішно!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
