import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export default function RoleMenu() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Quick Access</p>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <Link to={PATHS.ADMIN_DASHBOARD} className="block rounded-xl px-3 py-2 hover:bg-slate-100">
          Admin Dashboard
        </Link>
        <Link to={PATHS.MENTOR_DASHBOARD} className="block rounded-xl px-3 py-2 hover:bg-slate-100">
          Mentor Dashboard
        </Link>
        <Link to={PATHS.STUDENT_DASHBOARD} className="block rounded-xl px-3 py-2 hover:bg-slate-100">
          Student Dashboard
        </Link>
      </div>
    </div>
  );
}
