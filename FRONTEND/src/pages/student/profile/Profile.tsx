import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Edit2, X, Check, Calendar, Lock, User, Mail } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuthStore(); // Asumsi store menyediakan user_id, name, email, join_date, dll.

  // State untuk kontrol mode edit
  const [isEditing, setIsEditing] = useState(false);

  // State form lokal yang disinkronkan dengan data awal store
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '', // Dikosongkan secara default demi keamanan, diisi hanya jika ingin diubah
  });

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'S';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    // Reset form ke data asli dari store dan matikan mode edit
    setFormData({
      name: user?.name || '',
      password: '',
    });
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana jika nama dikosongkan
    if (!formData.name.trim()) {
      alert('Nama lengkap tidak boleh kosong!');
      return;
    }

    // Di sini nanti kamu tinggal panggil API update profile, contoh payload:
    // { user_id: user.user_id, name: formData.name, ...(formData.password && { password: formData.password }) }

    alert('Profil berhasil diperbarui!');
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola informasi akun dan kata sandi keamanan kamu</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Banner Atas & Foto Profil */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
            <span className="text-2xl font-extrabold text-white">{firstLetter}</span>
          </div>
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Siswa'}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs">
              <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Student
              </span>
              <span className="text-slate-400 font-medium">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Input Form Fields */}
        <div className="p-6 space-y-5">
          {/* Kolom Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" /> Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Masukkan nama lengkap kamu"
              className={`w-full px-4 py-2.5 rounded-xl border font-medium text-sm transition-all focus:outline-none ${isEditing
                  ? 'border-blue-500 bg-white ring-4 ring-blue-500/5 text-slate-900'
                  : 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                }`}
            />
          </div>

          {/* Kolom Email (Disabled Permanen) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Alamat Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-medium cursor-not-allowed text-sm"
            />
            <p className="text-[11px] text-slate-400 pl-1">Email digunakan sebagai ID akun utama dan tidak dapat diubah.</p>
          </div>

          {/* Kolom Password Baru */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" /> Kata Sandi Baru
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder={isEditing ? "Isi hanya jika ingin mengganti kata sandi" : "••••••••••••"}
              className={`w-full px-4 py-2.5 rounded-xl border font-medium text-sm transition-all focus:outline-none ${isEditing
                  ? 'border-blue-500 bg-white ring-4 ring-blue-500/5 text-slate-900 placeholder-slate-400'
                  : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                }`}
            />
          </div>
        </div>

        {/* Action Footer Bar */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-3">
          {!isEditing ? (
            // Tampilan Tombol saat Mode Read-Only
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Profil
            </Button>
          ) : (
            // Tampilan Tombol saat Mode Edit Aktif
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="text-xs font-bold flex items-center gap-1.5 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Batal
              </Button>
              <Button
                type="submit"
                className="text-xs font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                Simpan Perubahan
              </Button>
            </>
          )}
        </div>

      </form>
    </div>
  );
}