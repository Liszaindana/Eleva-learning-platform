import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import { PATHS } from '../../routes/paths';

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to={PATHS.HOME} className="text-lg font-bold text-slate-900">
            Eleva
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-700">
            <Link to={PATHS.HOME} className="hover:text-blue-600">
              Beranda
            </Link>
            <Link to={PATHS.KELAS} className="hover:text-blue-600">
              Kelas
            </Link>
            <Link to={PATHS.LOGIN} className="hover:text-blue-600">
              Masuk
            </Link>
            <Link to={PATHS.REGISTER} className="hover:text-blue-600">
              Daftar
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
