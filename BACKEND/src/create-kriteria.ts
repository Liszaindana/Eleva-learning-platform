// logging

import { prisma } from './lib/db.js';

async function main() {
    console.log('Seeding kriteria data...');

    // Data kriteria dengan nilai mapping
    const kriteriaData = [
        {
            kode: 'LAMA_MENGAJAR',
            nama: 'Lama Mengajar',
            tipe: 'benefit',
            bobot: 0.1,
            kepentingan: 1,
            values: [
                { value: '>5 Tahun', score: 5 },
                { value: '4 Tahun', score: 4 },
                { value: '3 Tahun', score: 3 },
                { value: '2 Tahun', score: 2 },
                { value: '1 Tahun', score: 1 }
            ]
        },
        {
            kode: 'RATING',
            nama: 'Rating Mentor',
            tipe: 'benefit',
            bobot: 0.3,
            kepentingan: 3,
            values: [
                { value: '4,8-5,0', score: 5 },
                { value: '4,6-4,7', score: 4 },
                { value: '4,2-4,5', score: 3 },
                { value: '3,8-4,1', score: 2 },
                { value: '<3,8', score: 1 }
            ]
        },
        {
            kode: 'JUMLAH_KELAS',
            nama: 'Jumlah Kelas',
            tipe: 'benefit',
            bobot: 0.15,
            kepentingan: 1.5,
            values: [
                { value: '>10', score: 5 },
                { value: '8-10', score: 4 },
                { value: '5-7', score: 3 },
                { value: '2-4', score: 2 },
                { value: '<2', score: 1 }
            ]
        },
        {
            kode: 'JUMLAH_PESERTA',
            nama: 'Jumlah Peserta',
            tipe: 'benefit',
            bobot: 0.2,
            kepentingan: 2,
            values: [
                { value: '>100', score: 5 },
                { value: '75-100', score: 4 },
                { value: '50-74', score: 3 },
                { value: '25-49', score: 2 },
                { value: '<25', score: 1 }
            ]
        },
        {
            kode: 'KELULUSAN',
            nama: 'Tingkat Kelulusan',
            tipe: 'benefit',
            bobot: 0.25,
            kepentingan: 2.5,
            values: [
                { value: '90-100', score: 5 },
                { value: '80-89', score: 4 },
                { value: '70-79', score: 3 },
                { value: '60-69', score: 2 },
                { value: '<60', score: 1 }
            ]
        }
    ];

    for (const kriteria of kriteriaData) {
        const existing = await prisma.kriteria.findUnique({
            where: { kode: kriteria.kode }
        });

        if (existing) {
            console.log(`✓ Kriteria '${kriteria.kode}' sudah ada, skip...`);
            continue;
        }

        const created = await prisma.kriteria.create({
            data: {
                kode: kriteria.kode,
                nama: kriteria.nama,
                tipe: kriteria.tipe,
                bobot: kriteria.bobot,
                kepentingan: kriteria.kepentingan,
                values: {
                    createMany: {
                        data: kriteria.values.map(v => ({
                            value: v.value,
                            score: v.score
                        }))
                    }
                }
            },
            include: { values: true }
        });

        console.log(`✓ Kriteria '${kriteria.nama}' berhasil dibuat dengan ${kriteria.values.length} nilai mapping`);
    }

    console.log('\n✅ Seeding kriteria selesai!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
