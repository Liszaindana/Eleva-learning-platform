# Frontend Implementation Plan

## Tujuan
Menyusun struktur folder `FRONTEND/src` yang bersih dan mudah dikembangkan untuk platform Eleva.
Struktur ini mengakomodasi:
- halaman publik (`landingpage` / `Beranda`)
- area mentor hanya untuk user berperan mentor
- area student hanya untuk user berperan siswa
- area admin hanya untuk user berperan admin
- reusable UI components
- route protection dan role based access
- API endpoint terpusat untuk dipakai dengan TanStack Query

---

## Recommended Folder Structure

```
FRONTEND/src/
  api/
    client.ts
    endpoints.ts
    auth.ts
    kelas.ts
    mentor.ts
    student.ts
    admin.ts
  components/
    ui/
      Badge.tsx
      Button.tsx
      Container.tsx
      EmptyState.tsx
      LoadingState.tsx
      SectionHeader.tsx
    layout/
      Navbar.tsx
      Footer.tsx
      Sidebar.tsx
      RoleMenu.tsx
    forms/
      AuthForm.tsx
      CategoryForm.tsx
      KelasForm.tsx
    widgets/
      UserCard.tsx
      StatCard.tsx
      CourseCard.tsx
  layouts/
    PublicLayout.tsx
    AuthLayout.tsx
    DashboardLayout.tsx
    MentorLayout.tsx
    StudentLayout.tsx
    AdminLayout.tsx
  pages/
    landing/
      LandingPage.tsx
    auth/
      LoginPage.tsx
      RegisterPage.tsx
    kelas/
      KelasListPage.tsx
      KelasDetailPage.tsx
    mentor/
      MentorDashboard.tsx
      mentor-class/
        MentorClassList.tsx
        MentorClassDetail.tsx
    student/
      StudentDashboard.tsx
      student-class/
        StudentClassList.tsx
        StudentClassDetail.tsx
    admin/
      AdminDashboard.tsx
      category/
        CategoryListPage.tsx
        CategoryCreatePage.tsx
        CategoryEditPage.tsx
      class/
        ClassListPage.tsx
        ClassCreatePage.tsx
        ClassEditPage.tsx
      user/
        UserListPage.tsx
        UserDetailPage.tsx
      review/
        ReviewListPage.tsx
  routes/
    AppRoutes.tsx
    protectedRoute.tsx
    roleRoute.tsx
    paths.ts
  store/
    authStore.ts
    userStore.ts
  config/
    queryClient.ts
  lib/
    utils.ts
  types/
    api.ts
    auth.ts
    learning.ts
```

---

## Penjelasan Setiap Folder

### `layouts/`
Folder ini berisi struktur halaman umum yang menempelkan header, sidebar, footer, dan outlet anak.

- `PublicLayout.tsx`
  - untuk halaman publik: landing, login, register, kelas.
  - tidak memerlukan login.
- `AuthLayout.tsx`
  - wrapper umum untuk semua halaman yang membutuhkan login.
- `DashboardLayout.tsx`
  - halaman utama area beranda setelah login, bisa berisi sidebar + header.
- `MentorLayout.tsx`, `StudentLayout.tsx`, `AdminLayout.tsx`
  - khusus untuk area role-based.
  - setiap layout hanya menampilkan menu dan konten sesuai peran.

### `pages/`
Folder halaman memang seharusnya berisi `page` component.

- `landing/`
  - `LandingPage.tsx` = halaman publik utama.
- `auth/`
  - `LoginPage.tsx` dan `RegisterPage.tsx`.
- `kelas/`
  - `KelasListPage.tsx`, `KelasDetailPage.tsx`.
- `mentor/`, `student/`, `admin/`
  - route khusus untuk role tertentu.
  - gunakan subfolder jika ada fitur khusus seperti category, class, user, review.

Contoh halaman admin:
- `admin/category/CategoryListPage.tsx`
- `admin/category/CategoryCreatePage.tsx`
- `admin/category/CategoryEditPage.tsx`

### `components/`
Reusable UI murni.

- `ui/` = tombol, badge, card, layout primitives.
- `layout/` = Navbar, Footer, Sidebar, RoleMenu.
- `forms/` = form yang bisa pakai kembali seperti category form, kelas form.
- `widgets/` = kartu dan panel informasi.

### `routes/`
Semua aturan route dan akses.

- `AppRoutes.tsx`
  - definisi route utama.
- `protectedRoute.tsx`
  - hanya bisa diakses jika sudah login.
- `roleRoute.tsx`
  - membatasi akses berdasarkan `user.role`.
- `paths.ts`
  - menyimpan semua path route untuk konsistensi.

### `store/`
State global terkait auth/user.

- `authStore.ts`
  - menyimpan `isAuthenticated`, `user`, `token`, `login`, `logout`.
- `userStore.ts`
  - jika perlu menyimpan user tambahan, preferensi, atau state global lain.

### `api/`
Semua endpoint terpusat agar mudah dipanggil dengan TanStack Query.

- `client.ts`
  - axios atau fetch client dengan interceptors.
- `endpoints.ts`
  - wrapper fungsi API umum.
- `auth.ts`, `kelas.ts`, `mentor.ts`, `student.ts`, `admin.ts`
  - jika ingin memisahkan per domain.

### `config/`
- `queryClient.ts`
  - inisialisasi `QueryClient` TanStack Query.

### `lib/`
- util helper umum seperti `formatDate`, `truncateText`, `getRoleLabel`.

### `types/`
- definisi tipe TypeScript.
- `api.ts`, `auth.ts`, `learning.ts`.

---

## Rencana Migrasi dari Struktur Saat Ini

1. `FRONTEND/src/layouts/PublicLayout.tsx`
   - tetap disimpan di `layouts/`.
2. `FRONTEND/src/pages/Beranda.tsx`
   - pindahkan ke `pages/landing/LandingPage.tsx`.
3. `FRONTEND/src/pages/auth/LoginPage.tsx` dan `RegisterPage.tsx`
   - tetap di `pages/auth/`.
4. `FRONTEND/src/pages/kelas/KelasListPage.tsx` dan `KelasDetailPage.tsx`
   - tetap di `pages/kelas/`.
5. `FRONTEND/src/pages/mentor/Dashboard.tsx`
   - pindahkan ke `pages/mentor/MentorDashboard.tsx`.
6. Tambahkan folder baru:
   - `pages/student/`
   - `pages/admin/`
   - `layouts/MentorLayout.tsx`
   - `layouts/StudentLayout.tsx`
   - `layouts/AdminLayout.tsx`
7. `routes/AppRoutes.tsx`
   - update dengan route publik + protected + role-based.
8. `store/authStore.ts`
   - jika sudah ada, pastikan fungsi `logout`, `login`, `setUser`, `setRole` lengkap.
9. `api/endpoints.ts`
   - pisahkan bila perlu.
10. Tambahkan `components/layout/` dan `components/forms/` untuk reusable UI.

---

## Contoh Struktur Routes yang Disarankan

```tsx
// AppRoutes.tsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route path={PATHS.HOME} element={<LandingPage />} />
    <Route path={PATHS.LOGIN} element={<LoginPage />} />
    <Route path={PATHS.REGISTER} element={<RegisterPage />} />
    <Route path={PATHS.KELAS} element={<KelasListPage />} />
    <Route path={PATHS.KELAS_DETAIL} element={<KelasDetailPage />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route element={<MentorLayout />}>
      <Route path={PATHS.MENTOR_DASHBOARD} element={<MentorDashboard />} />
      {/* route mentor lain */}
    </Route>

    <Route element={<StudentLayout />}>
      <Route path={PATHS.STUDENT_DASHBOARD} element={<StudentDashboard />} />
      {/* route student lain */}
    </Route>

    <Route element={<AdminLayout />}>
      <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
      <Route path={PATHS.ADMIN_CATEGORY_LIST} element={<CategoryListPage />} />
      <Route path={PATHS.ADMIN_CATEGORY_CREATE} element={<CategoryCreatePage />} />
      {/* route admin lain */}
    </Route>
  </Route>
</Routes>
```

---

## Catatan Khusus

- `public` = bebas diakses tanpa login.
- `mentor`, `student`, dan `admin` harus menggunakan `ProtectedRoute` + `roleRoute`.
- `components/ui/` sebaiknya hanya berisi komponen presentasional tanpa state besar.
- Gunakan `store/authStore.ts` untuk menyimpan user dan status login, lalu panggilnya di layout dan protected route.
- Jika ingin konsisten seperti proyek re-engineering sebelumnya, `mainlayout` bisa diganti `DashboardLayout.tsx` untuk area user umum setelah login.

---

## Langkah Selanjutnya

1. Buat folder baru sesuai rencana.
2. Pindahkan halaman yang sudah ada ke path baru.
3. Perbarui `AppRoutes.tsx` dengan route baru.
4. Buat `ProtectedRoute` dan `roleRoute`.
5. Buat `QueryClient` di `config/queryClient.ts`.
6. Refactor `api/endpoints.ts` ke domain-area bila perlu.

Jika kamu ingin, saya bisa langsung bantu buat folder + file awal untuk struktur ini di `FRONTEND/src`.   
