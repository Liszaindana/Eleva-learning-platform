import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PATHS } from './paths';

interface RoleRouteProps {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  const normalizedRole = user?.role?.toLowerCase() ?? '';
  const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());
  const allowedWithAliases = normalizedAllowed.flatMap((role) =>
    role === 'student' ? ['student', 'siswa'] : [role]
  );

  if (!user || !allowedWithAliases.includes(normalizedRole)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
}
