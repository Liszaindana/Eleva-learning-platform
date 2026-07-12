import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';
import { authApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import logo from '../../assets/Logo.PNG';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token, data.user);
      const role = String(data.user?.role || '').toLowerCase();
      if (role === 'siswa' || role === 'student' || role === '1') {
        navigate(PATHS.STUDENT_DASHBOARD);
        return;
      }
      if (role === 'mentor') {
        navigate(PATHS.MENTOR_DASHBOARD);
        return;
      }
      if (role === 'admin') {
        navigate(PATHS.ADMIN_DASHBOARD);
        return;
      }

      navigate(PATHS.HOME);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate({ email: form.email, password: form.password });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-blue-100 to-blue-50 rounded-full blur-3xl" />
      </div>
      <Container className="max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4">
              <img src={logo} alt="Eleva Logo" className="h-20 w-20 object-contain mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Selamat Datang</h1>
            <p className="mt-1.5 text-sm text-slate-600">Masuk ke akun Eleva untuk melanjutkan belajar</p>
          </div>
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input id="login-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@email.com" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="login-password" type={showPw ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Masukkan password" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" isLoading={mutation.isPending} className="w-full"><LogIn className="h-4 w-4" />Masuk</Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{' '}
            <Link to={PATHS.REGISTER} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Daftar sekarang</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
