# Troubleshooting Error 500 pada Endpoint /recommendation

## 🔍 Diagnosis

Error 500 saat mengakses endpoint `/recommendation` (khususnya saat mencoba membuat rekomendasi) umumnya terjadi karena:

1. **⚠️ Migrations belum diterapkan** - Kolom `kepentingan` di tabel `kriteria` belum ada
2. **⚠️ Data kriteria belum diisi** - Tabel `kriteria` dan `kriteria_value` kosong
3. **⚠️ Data master belum ada** - Tidak ada kategori, periode, atau mentor di database
4. **⚠️ Database kosong setelah drop** - Semua data dan struktur hilang

## ✅ Solusi

Setelah drop database dan membuat database baru, jalankan setup lengkap dengan:

### Option 1: Menggunakan Setup Script (Recommended)

```bash
npm run setup
```

Script ini akan otomatis:
- ✓ Menjalankan Prisma migrations
- ✓ Membuat admin user (admin@eleva.com / admin123)
- ✓ Seeding data kriteria dan kriteria_value
- ✓ Seeding data test (mentors, students, classes, dll)

### Option 2: Manual Steps

Jika ingin menjalankan step-by-step:

#### 1. Update Database Schema (Migrations)
```bash
npx prisma migrate deploy
```

Ini akan menjalankan migration `20260712135745_finalizing_tabel_for_spk` yang menambahkan:
- Kolom `kepentingan` di tabel `kriteria` (untuk WP dan TOPSIS method)
- Unique constraint pada `kriteria_value`

**Troubleshooting**: Jika mendapat error "Duplicate column name 'kepentingan'":
```bash
npx prisma migrate resolve --rolled-back 20260712135745_finalizing_tabel_for_spk
npx prisma migrate deploy
```

#### 2. Create Admin User
```bash
npx tsx src/create-admin.ts
```

Login credentials:
- Email: `admin@eleva.com`
- Password: `admin123`

#### 3. Seed Kriteria Data (WAJIB!)
```bash
npx tsx src/create-kriteria.ts
```

Ini membuat data kriteria yang diperlukan:
- **LAMA_MENGAJAR** (0.1 bobot) - Tahun mengajar mentor
- **RATING** (0.3 bobot) - Rating dari review siswa
- **JUMLAH_KELAS** (0.15 bobot) - Jumlah kelas aktif
- **JUMLAH_PESERTA** (0.2 bobot) - Jumlah siswa total
- **KELULUSAN** (0.25 bobot) - Rata-rata score exam

Setiap kriteria memiliki mapping score (1-5) berdasarkan range nilai.

#### 4. Create Admin User (Optional - untuk testing)
```bash
npx tsx src/seed-test-data.ts
```

Membuat:
- 3 test mentor dengan classes
- 3 test students dengan enrollment
- Review dan exam scores untuk testing

## 🧪 Testing

Setelah setup selesai, test endpoint dengan:

```bash
npm run dev
```

Kemudian di terminal lain:
```bash
npx tsx src/test-recommendation.ts
```

Output yang diharapkan:
```
✓ Login successful
✓ Got category: 1
✓ Got periode: 1
✓ Recommendation created successfully!
  Method: SAW
  Results count: 8
  Top mentor: Budi Santoso Score: 0.9

✅ All tests passed!
```

## 📊 Understanding Recommendation Method

### 1. SAW (Simple Additive Weighting)
- Menggunakan `bobot` dari tabel `kriteria`
- Formula: Σ(R_ij × W_j) di mana R_ij adalah normalized score

### 2. WP (Weighted Product)
- Menggunakan `kepentingan` dari tabel `kriteria`
- Formula: Π(x_ij ^ w_j) untuk benefit, Π(x_ij ^ -w_j) untuk cost

### 3. TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)
- Juga menggunakan `kepentingan`
- Menghitung jarak ke ideal solution (positif dan negatif)

## 🔧 API Endpoints

### Create Recommendation
```
POST /recommendation
Authorization: Bearer {token}
Content-Type: application/json

{
  "category_id": 1,
  "periode_id": 1,
  "method": "SAW" | "WP" | "TOPSIS",
  "weights": [optional - custom weights array]
}
```

Response:
```json
{
  "message": "Rekomendasi mentor berhasil dihitung.",
  "data": {
    "id_recomen": 1,
    "method": "SAW",
    "results": [
      {
        "ranking": 1,
        "score": 0.95,
        "user": {
          "user_id": 5,
          "name": "Mentor Name",
          "email": "mentor@email.com"
        }
      }
    ]
  }
}
```

### Get Recommendation History
```
GET /recommendation/history
Authorization: Bearer {token}
```

### Get Recommendation Detail
```
GET /recommendation/:id
Authorization: Bearer {token}
```

### Delete Recommendation
```
DELETE /recommendation/:id
Authorization: Bearer {token}
```

## 🛠️ Common Issues

### Issue: "Belum ada data kriteria di sistem"
**Solution**: Run `npx tsx src/create-kriteria.ts`

### Issue: "Belum ada skala kriteria_value untuk kriteria..."
**Solution**: Same as above - kriteria values mapping is missing

### Issue: "Tidak ada mentor pada kategori & periode ini"
**Solution**: 
- Check if there are classes for the category and periode
- Ensure mentor (user with role 'mentor') has active classes

### Issue: "Masih ada kriteria yang belum memiliki nilai kepentingan" (for WP/TOPSIS)
**Solution**: Run create-kriteria script again, or manually set `kepentingan` value for each kriteria

## 📝 Database Schema

### Kriteria Table
```sql
CREATE TABLE kriteria (
  id_kriteria INT PRIMARY KEY AUTO_INCREMENT,
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  tipe VARCHAR(20) NOT NULL, -- 'benefit' or 'cost'
  bobot FLOAT NOT NULL, -- for SAW
  kepentingan INT, -- for WP/TOPSIS
)
```

### KriteriaValue Table
```sql
CREATE TABLE kriteria_value (
  id_value INT PRIMARY KEY AUTO_INCREMENT,
  id_kriteria INT NOT NULL,
  value VARCHAR(50) NOT NULL, -- e.g., "4,8-5,0", ">5 Tahun"
  score FLOAT NOT NULL, -- 1-5
  UNIQUE(id_kriteria, value),
  FOREIGN KEY (id_kriteria) REFERENCES kriteria(id_kriteria)
)
```

## 🔗 Related Files

- [recommendationcontroller.ts](../src/controllers/recommendationcontroller.ts) - Main business logic
- [kriteriaScoring.ts](../src/lib/kriteriaScoring.ts) - Score conversion logic
- [mentorMetrics.ts](../src/lib/mentorMetrics.ts) - Metric calculation for each kriteria
- [schema.prisma](../prisma/schema.prisma) - Database schema

---

**Last Updated**: 2026-07-14
**Status**: ✅ All recommendations working
