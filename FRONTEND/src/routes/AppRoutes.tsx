import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import MentorLayout from '../layouts/MentorLayout';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './protectedRoute';
import RoleRoute from './roleRoute';
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import KelasListPage from '../pages/kelas/KelasListPage';
import KelasDetailPage from '../pages/kelas/KelasDetailPage';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CategoryListPage from '../pages/admin/category/CategoryListPage';
import CategoryCreatePage from '../pages/admin/category/CategoryCreatePage';
import CategoryEditPage from '../pages/admin/category/CategoryEditPage';
import ClassListPage from '../pages/admin/class/ClassListPage';
import ClassCreatePage from '../pages/admin/class/ClassCreatePage';
import ClassEditPage from '../pages/admin/class/ClassEditPage';
import UserListPage from '../pages/admin/user/UserListPage';
import ReviewListPage from '../pages/admin/review/ReviewListPage';
import { PATHS } from './paths';
import RecommendationPage from '../pages/spk/RecommendationPage';
import DashboardLayout from '../layouts/DashboardLayout';
import RecommendationHistoryPage from '../pages/spk/RecommendationHistoryPage';
import RecommendationDetailPage from '../pages/spk/RecommendationDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path={PATHS.HOME} element={<LandingPage />} />
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.KELAS} element={<KelasListPage />} />
        <Route path={PATHS.KELAS_DETAIL} element={<KelasDetailPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['mentor']} />}>
          <Route element={<MentorLayout />}>
            <Route path={PATHS.MENTOR_DASHBOARD} element={<MentorDashboard />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path={PATHS.STUDENT_DASHBOARD} element={<StudentDashboard />} />
          </Route>
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path={PATHS.RECOMMENDATION} element={<RecommendationPage />} />
          <Route path={PATHS.RECOMMENDATION_HISTORY} element={<RecommendationHistoryPage />} />
          <Route path={PATHS.RECOMMENDATION_DETAIL} element={<RecommendationDetailPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={PATHS.ADMIN_CATEGORY_LIST} element={<CategoryListPage />} />
            <Route path={PATHS.ADMIN_CATEGORY_CREATE} element={<CategoryCreatePage />} />
            <Route path={PATHS.ADMIN_CATEGORY_EDIT} element={<CategoryEditPage />} />
            <Route path={PATHS.ADMIN_CLASS_LIST} element={<ClassListPage />} />
            <Route path={PATHS.ADMIN_CLASS_CREATE} element={<ClassCreatePage />} />
            <Route path={PATHS.ADMIN_CLASS_EDIT} element={<ClassEditPage />} />
            <Route path={PATHS.ADMIN_USER_LIST} element={<UserListPage />} />
            <Route path={PATHS.ADMIN_REVIEW_LIST} element={<ReviewListPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
