import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={PATHS.HOME} className="text-xl font-semibold text-slate-900">
          Eleva
        </Link>
        <nav className="flex items-center gap-3">
          <Link to={PATHS.HOME} className="text-sm text-slate-600 hover:text-slate-900">
            Beranda
          </Link>
          <Link to={PATHS.KELAS} className="text-sm text-slate-600 hover:text-slate-900">
            Kelas
          </Link>
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Link to={PATHS.LOGIN} className="text-sm text-slate-600 hover:text-slate-900">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
