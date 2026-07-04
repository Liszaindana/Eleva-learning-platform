# Eleva Learning Platform

## Deskripsi Proyek
Eleva Learning Platform adalah aplikasi pembelajaran daring yang terdiri dari backend API dan frontend React.
Aplikasi ini mendukung beberapa peran: admin, mentor, dan student, serta halaman publik untuk landing page, login, register, dan daftar kelas.

## Struktur Proyek

### Backend (`BACKEND/`)
- `src/index.ts` - titik masuk server Express.
- `src/controllers/` - logika untuk CRUD dan endpoint.
- `src/routes/` - rute API terpisah untuk setiap resource.
- `src/lib/db.ts` - koneksi Prisma ke database.
- `prisma/schema.prisma` - definisi model dan relasi database.

### Frontend (`FRONTEND/`)
- `src/App.tsx` - wrapper React Router dan QueryClient.
- `src/routes/` - definisi navigation dan proteksi route.
- `src/layouts/` - layout publik, auth, dan dashboard per role.
- `src/pages/` - halaman sesuai area publik, admin, mentor, student, auth.
- `src/components/` - komponen reusable UI, form, dan layout.
- `src/api/` - client axios dan endpoint API terpusat.
- `src/store/` - state auth global menggunakan Zustand.
- `src/types/` - tipe TypeScript untuk data API.

## Teknologi Utama
- Node.js + Express
- TypeScript
- Prisma
- React
- React Router v7
- TanStack Query
- Zustand
- Axios
- Tailwind CSS
- Vite

## Fitur Utama
- halaman publik: landing page, login, register, daftar kelas.
- proteksi route untuk user yang harus login.
- role-based access untuk mentor, student, dan admin.
- layout terpisah untuk area publik dan dashboard.
- struktur API modular untuk kemudahan pemanggilan oleh TanStack Query.
- authentication state persistence dengan `zustand`.

## Progres yang Sudah Dikerjakan

1. Merge branch lokal `main` dengan `ayu` dan push hasil merge ke remote `origin/ayu`.
2. Menyatukan branch `ayu` ke `main` lalu push hasil merge ke remote `origin/main`.
3. Menyusun ulang frontend menjadi struktur yang lebih modular:
   - menambahkan folder `layouts/` untuk `PublicLayout`, `AuthLayout`, `DashboardLayout`, `MentorLayout`, `StudentLayout`, `AdminLayout`.
   - menambahkan folder `components/layout/` untuk `Navbar`, `Footer`, `Sidebar`, dan `RoleMenu`.
   - menambahkan folder `components/forms/` untuk form reusable seperti `AuthForm`, `CategoryForm`, dan `KelasForm`.
   - membangun struktur `api/` untuk domain `kelas`, `mentor`, `student`, `admin`.
   - menambahkan `types/auth.ts` untuk tipe auth dan payload register/login.
4. Memperbarui `routes/AppRoutes.tsx` agar mendukung:
   - route publik dalam `PublicLayout`
   - route proteksi `ProtectedRoute`
   - role-based route untuk mentor, student, dan admin menggunakan `RoleRoute`
5. Menambahkan path path route di `routes/paths.ts` untuk semua halaman penting.
6. Memperbaiki beberapa error TypeScript pada scaffold baru agar kompilasi dapat berjalan.

## Cara Menjalankan

### Backend

1. Masuk ke folder `BACKEND/`
2. Jalankan `npm install`
3. Jalankan server dengan `npm run dev` atau sesuai script yang sudah tersedia.

### Frontend

1. Masuk ke folder `FRONTEND/`
2. Jalankan `npm install`
3. Jalankan `npm run dev`

## Catatan Tambahan
- Pastikan `.env` sudah berisi `VITE_API_URL` yang mengarah ke backend.
- Gunakan `QueryClient` dari `@tanstack/react-query` untuk mengelola request API.
- Struktur baru ini dirancang agar mudah dikembangkan untuk fitur admin category/class/user/review dan area mentor/student.

## Next Steps
- Lengkapi halaman `mentor`, `student`, dan `admin` dengan data nyata dari backend.
- Tambahkan `roleRoute` pada halaman dashboard agar akses benar.
- Buat `ProtectedRoute` generik untuk semua halaman yang membutuhkan login.
- Integrasi lebih lanjut antara `api/endpoints.ts` dan setiap page menggunakan TanStack Query.
