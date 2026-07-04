import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store/authStore';

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">Menu</p>
        </div>

        <div className="space-y-2 text-sm text-slate-700">
          <Link to={PATHS.ADMIN_DASHBOARD} className="block rounded-xl px-4 py-3 transition hover:bg-slate-100">
            Admin Dashboard
          </Link>
          <Link to={PATHS.MENTOR_DASHBOARD} className="block rounded-xl px-4 py-3 transition hover:bg-slate-100">
            Mentor Dashboard
          </Link>
          <Link to={PATHS.STUDENT_DASHBOARD} className="block rounded-xl px-4 py-3 transition hover:bg-slate-100">
            Student Dashboard
          </Link>
        </div>

        {user && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Signed in as</p>
            <p className="mt-2 text-sm text-slate-600">{user.name}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{user.role}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
