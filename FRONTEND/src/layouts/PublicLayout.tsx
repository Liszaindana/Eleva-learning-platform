import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, LogIn, UserPlus } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { PATHS } from '../routes/paths';

const navLinks = [
  { label: 'Beranda', path: PATHS.HOME },
  { label: 'Kelas', path: PATHS.KELAS },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={PATHS.HOME} className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
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
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth buttons (desktop) */}
            <div className="hidden md:flex items-center gap-2">
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
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top-2">
            <Container className="py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-white/5 mt-3">
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
      <footer className="border-t border-white/5 bg-slate-950">
        <Container className="py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-300">Eleva Learning</span>
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
