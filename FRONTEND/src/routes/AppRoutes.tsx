import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Beranda from '../pages/Beranda';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import KelasListPage from '../pages/kelas/KelasListPage';
import KelasDetailPage from '../pages/kelas/KelasDetailPage';
import MentorDashboard from '../pages/mentor/Dashboard';
import { PATHS } from './paths';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={PATHS.HOME} element={<Beranda />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.KELAS} element={<KelasListPage />} />
        <Route path={PATHS.KELAS_DETAIL} element={<KelasDetailPage />} />
      </Route>
      {/* Standalone Route for Mentor Dashboard (Independent of PublicLayout header/footer) */}
      <Route path={PATHS.MENTOR_DASHBOARD} element={<MentorDashboard />} />
    </Routes>
  );
}
