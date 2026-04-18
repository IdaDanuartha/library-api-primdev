import bcrypt from 'bcrypt'
import { Faker, id_ID } from '@faker-js/faker';
import prisma from '../config/database.config.js';

// Menggunakan lokalisasi Indonesia agar data lebih relevan
const faker = new Faker({ locale: [id_ID] });

async function main() {
  console.log('--- Memulai proses Seeding ---');

  // 1. Bersihkan Data (Urutan sangat penting karena Foreign Key)
  console.log('Membersihkan data lama...');
  await prisma.borrowings.deleteMany();
  await prisma.profiles.deleteMany();
  await prisma.books.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.users.deleteMany();

  // 2. Seed Categories (15 data)
  console.log('Seeding Categories...');
  const categoryNames = [
    'Teknologi', 'Sains', 'Novel', 'Sejarah', 'Komik', 
    'Biografi', 'Religi', 'Psikologi', 'Bisnis', 'Sastra',
    'Masakan', 'Kesehatan', 'Seni', 'Politik', 'Filsafat'
  ];
  
  await prisma.categories.createMany({
    data: categoryNames.map(name => ({ name }))
  });
  const allCategories = await prisma.categories.findMany();

  let password = await bcrypt.hash('password123', 10);

  // 3. Seed Users (25 data)
  console.log('Seeding Users...');
  const usersData = Array.from({ length: 25 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: password, // Dalam realita, pastikan di-hash (bcrypt)
    role: faker.helpers.arrayElement(['USER', 'ADMIN']),
  }));

  for (const userData of usersData) {
    const user = await prisma.users.create({
      data: {
        ...userData,
        // Langsung buat Profiles (One-to-One)
        profiles: {
          create: {
            address: faker.location.streetAddress(),
            phone: faker.phone.number(),
          }
        }
      }
    });
  }
  const allUsers = await prisma.users.findMany();

  // 4. Seed Books (30 data)
  console.log('Seeding Books...');
  const booksData = Array.from({ length: 30 }).map(() => ({
    title: faker.commerce.productName(),
    author: faker.person.fullName(),
    year: faker.number.int({ min: 2000, max: 2024 }),
    available: faker.datatype.boolean(),
    categoryId: faker.helpers.arrayElement(allCategories).id,
  }));

  await prisma.books.createMany({ data: booksData });
  const allBooks = await prisma.books.findMany();

  // 5. Seed Borrowings (20 data)
  console.log('Seeding Borrowings...');
  const borrowingsData = Array.from({ length: 20 }).map(() => {
    const isReturned = faker.datatype.boolean();
    return {
      userId: faker.helpers.arrayElement(allUsers).id,
      bookId: faker.helpers.arrayElement(allBooks).id,
      borrow_date: faker.date.past(),
      returned_at: isReturned ? faker.date.recent() : null,
    };
  });

  for (const borrow of borrowingsData) {
    await prisma.borrowings.create({ data: borrow });
  }

  console.log('--- Seeding Selesai Berhasil ---');
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });