// logging

import { prisma } from './lib/db.js';
import bcrypt from 'bcrypt';

async function main() {
  // First check roles
  const roles = await prisma.role.findMany();
  console.log('Existing Roles:', roles);

  // Check if admin exists
  let adminRole = await prisma.role.findFirst({
    where: { role_text: 'admin' }
  });

  if (!adminRole) {
    console.log('Creating admin role...');
    adminRole = await prisma.role.create({
      data: { role_text: 'admin' }
    });
    console.log('Admin role created:', adminRole);
  }

  // Check if we have mentor role
  let mentorRole = await prisma.role.findFirst({
    where: { role_text: 'mentor' }
  });
  if (!mentorRole) {
    console.log('Creating mentor role...');
    mentorRole = await prisma.role.create({
      data: { role_text: 'mentor' }
    });
  }

  // Check if we have siswa role
  let siswaRole = await prisma.role.findFirst({
    where: { role_text: 'siswa' }
  });
  if (!siswaRole) {
    console.log('Creating siswa role...');
    siswaRole = await prisma.role.create({
      data: { role_text: 'siswa' }
    });
  }

  // Check if admin user exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@eleva.com' }
  });
  if (existingAdmin) {
    console.log('Admin user already exists:', existingAdmin.email);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const newAdmin = await prisma.user.create({
    data: {
      name: 'Admin Eleva',
      email: 'admin@eleva.com',
      password: hashedPassword,
      role_id: adminRole.role_id
    },
    include: { role: true }
  });

  console.log('Admin user created successfully!');
  console.log('Email:', newAdmin.email);
  console.log('Password:', 'admin123');
  console.log('Role:', newAdmin.role.role_text);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
