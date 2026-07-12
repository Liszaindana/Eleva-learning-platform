import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../store/authStore';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/endpoints';
import logo from '../assets/Logo.PNG';

const navLinks = [
  { label: 'Beranda', path: PATHS.HOME },
  { label: 'Kelas', path: PATHS.KELAS },
];


export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={PATHS.HOME} className="flex items-center gap-2.5 group">
              <img src={logo} alt="Eleva Logo" className="h-10 w-10 object-contain" />
              <span className="text-lg font-bold text-slate-900">
                Eleva
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth buttons (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {user.role}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={logoutMutation.isPending}>
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <>
                  <Link to={PATHS.LOGIN}>
                    <Button variant="ghost" size="sm">
                      <LogIn className="h-4 w-4" />
                      Masuk
                    </Button>
                  </Link>
                  <Link to={PATHS.REGISTER}>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4" />
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top-2">
            <Container className="py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-slate-100 mt-3">
                {isAuthenticated && user ? (
                  <div className="px-4 py-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={logoutMutation.isPending} className="w-full">
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to={PATHS.LOGIN} onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        <LogIn className="h-4 w-4" />
                        Masuk
                      </Button>
                    </Link>
                    <Link to={PATHS.REGISTER} onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full">
                        <UserPlus className="h-4 w-4" />
                        Daftar
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </Container>
          </div>
        )}
      </header>

      {/* ── Page content ───────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <Container className="py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Eleva Logo" className="h-8 w-8 object-contain" />
              <span className="text-sm font-semibold text-slate-700">Eleva Learning</span>
            </div>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Eleva Learning Platform. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
