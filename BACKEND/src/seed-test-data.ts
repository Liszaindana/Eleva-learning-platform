// logging

import { prisma } from './lib/db.js';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Seeding data untuk testing recommendation...');

    // 1. Pastikan roles ada
    console.log('\n1. Checking roles...');
    const adminRole = await prisma.role.upsert({
        where: { role_text: 'admin' },
        update: {},
        create: { role_text: 'admin' }
    });

    const mentorRole = await prisma.role.upsert({
        where: { role_text: 'mentor' },
        update: {},
        create: { role_text: 'mentor' }
    });

    const siswaRole = await prisma.role.upsert({
        where: { role_text: 'siswa' },
        update: {},
        create: { role_text: 'siswa' }
    });
    console.log('✓ Roles ready');

    // 2. Buat kategori jika belum ada
    console.log('\n2. Creating categories...');
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        await prisma.category.createMany({
            data: [
                { categories: 'Web Development' },
                { categories: 'Mobile Development' },
                { categories: 'Data Science' },
                { categories: 'UI/UX Design' },
                { categories: 'DevOps' }
            ]
        });
        console.log('✓ Categories created');
    } else {
        console.log(`✓ Categories already exist (${categories.length})`);
    }

    // 3. Buat periode jika belum ada
    console.log('\n3. Creating periods...');
    const periods = await prisma.periode.findMany();
    if (periods.length === 0) {
        await prisma.periode.createMany({
            data: [
                { year: 2025 },
                { year: 2026 }
            ]
        });
        console.log('✓ Periods created');
    } else {
        console.log(`✓ Periods already exist (${periods.length})`);
    }

    // 4. Buat level jika belum ada
    console.log('\n4. Creating levels...');
    const levels = await prisma.level.findMany();
    if (levels.length === 0) {
        await prisma.level.createMany({
            data: [
                { level_info: 'Beginner' },
                { level_info: 'Intermediate' },
                { level_info: 'Advanced' }
            ]
        });
        console.log('✓ Levels created');
    } else {
        console.log(`✓ Levels already exist (${levels.length})`);
    }

    // 5. Buat beberapa mentor dengan rating, kelas, peserta, dll
    console.log('\n5. Creating mentors and classes...');

    const mentorEmails = [
        'mentor1@eleva.com',
        'mentor2@eleva.com',
        'mentor3@eleva.com'
    ];

    const hashedPassword = await bcrypt.hash('mentor123', 10);

    for (let i = 0; i < mentorEmails.length; i++) {
        const email = mentorEmails[i];
        const existing = await prisma.user.findUnique({ where: { email } });

        if (!existing) {
            const mentor = await prisma.user.create({
                data: {
                    name: `Mentor ${i + 1}`,
                    email,
                    password: hashedPassword,
                    role_id: mentorRole.role_id,
                    join_date: new Date(new Date().getFullYear() - (i + 1), 0, 1) // Join dates 1, 2, 3 years ago
                }
            });

            const category = await prisma.category.findFirst();
            const periode = await prisma.periode.findFirst();
            const level = await prisma.level.findFirst();

            // Create 2-3 classes per mentor
            const classCount = i + 2; // 2, 3, 4 classes
            for (let j = 0; j < classCount; j++) {
                await prisma.class.create({
                    data: {
                        user_id: mentor.user_id,
                        category_id: category!.category_id,
                        periode_id: periode!.periode_id,
                        level_id: level!.level_id,
                        title: `${mentor.name} - Class ${j + 1}`,
                        description: `Class ${j + 1} dari ${mentor.name}`,
                        is_active: true
                    }
                });
            }

            console.log(`✓ Mentor '${mentor.name}' created with ${classCount} classes`);
        } else {
            console.log(`✓ Mentor '${email}' already exists`);
        }
    }

    // 6. Buat beberapa siswa dan enrollment
    console.log('\n6. Creating students and enrollments...');

    const studentEmails = [
        'siswa1@eleva.com',
        'siswa2@eleva.com',
        'siswa3@eleva.com'
    ];

    for (const email of studentEmails) {
        const existing = await prisma.user.findUnique({ where: { email } });

        if (!existing) {
            const siswa = await prisma.user.create({
                data: {
                    name: email.split('@')[0],
                    email,
                    password: hashedPassword,
                    role_id: siswaRole.role_id
                }
            });

            // Enroll in some classes
            const classes = await prisma.class.findMany({ take: 2 });
            for (const cls of classes) {
                await prisma.enrollment.create({
                    data: {
                        user_id: siswa.user_id,
                        class_id: cls.class_id,
                        role_in_class: 'student',
                        progress: Math.floor(Math.random() * 100)
                    }
                });
            }

            console.log(`✓ Student '${siswa.name}' created`);
        } else {
            console.log(`✓ Student '${email}' already exists`);
        }
    }

    // 7. Buat beberapa review dan exam scores
    console.log('\n7. Creating reviews and exam scores...');

    const reviews = await prisma.review.findMany();
    if (reviews.length === 0) {
        const enrollments = await prisma.enrollment.findMany({ take: 5 });

        for (const enrollment of enrollments) {
            // Create review
            await prisma.review.create({
                data: {
                    user_id: enrollment.user_id,
                    class_id: enrollment.class_id,
                    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                    comment: 'Kelas yang bagus!'
                }
            });

            // Create exam
            await prisma.exam.create({
                data: {
                    user_id: enrollment.user_id,
                    class_id: enrollment.class_id,
                    title: `Exam for Class ${enrollment.class_id}`,
                    score: Math.floor(Math.random() * 40) + 60, // 60-100
                    is_passed: true
                }
            });
        }
        console.log('✓ Reviews and exams created');
    } else {
        console.log(`✓ Reviews already exist (${reviews.length})`);
    }

    console.log('\n✅ All test data seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
