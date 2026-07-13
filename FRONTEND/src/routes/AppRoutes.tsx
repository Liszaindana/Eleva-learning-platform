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
import KelasListPage from '../pages/class/ClassListPage';
import KelasDetailPage from '../pages/class/ClassDetailPage';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// --- HALAMAN ADMIN ---
import CategoryListPage from '../pages/admin/category/CategoryListPage';
import CategoryCreatePage from '../pages/admin/category/CategoryCreatePage';
import CategoryEditPage from '../pages/admin/category/CategoryEditPage';
import ClassListPage from '../pages/admin/class/ClassListPage';
import ClassCreatePage from '../pages/admin/class/ClassCreatePage';
import ClassEditPage from '../pages/admin/class/ClassEditPage';
import UserListPage from '../pages/admin/user/UserListPage';
import ReviewListPage from '../pages/admin/review/ReviewListPage';
import KriteriaListPage from '../pages/admin/kriteria/KriteriaListPage';
import KriteriaValueListPage from '../pages/admin/kriteria/KriteriaValueListPage';
import AdminRecommendationListPage from '../pages/admin/recommendation/AdminRecommendationListPage';
import AdminRecommendationDetailPageadmin from '../pages/admin/spkadmin/ReccomendationDetailPageadmin.tsx';


// --- IMPORT HALAMAN MENTOR  ---
import MentorClassListPage from '../pages/mentor/class/ClassListPage';
import MentorClassCreatePage from '../pages/mentor/class/ClassCreatePage';
import MentorClassEditPage from '../pages/mentor/class/ClassEditPage';
import MateriListPage from '../pages/mentor/materi/MateriListPage';
import MateriCreatePage from '../pages/mentor/materi/MateriCreatePage';
import MateriEditPage from '../pages/mentor/materi/MateriEditPage';
import MentorReview from '../pages/mentor/MentorReview';
import MentorProfile from '../pages/mentor/MentorProfile';

// --- IMPORT HALAMAN STUDENT ---
import MyCoursesPage from '../pages/student/courses/CourseCatalog.tsx';
import CourseLearningDetailPage from '../pages/student/courses/CourseDetail.tsx';
import MaterialVideoPage from '../pages/student/materials/MaterialList';
import LearningProgressPage from '../pages/student/progress/LearningProgresList.tsx';
import ExamsGradesPage from '../pages/student/exams/ExamsGradesPage';
import ClassReviewPage from '../pages/student/reviews/CreateReview';
import ProfilePage from '../pages/student/profile/Profile.tsx';

import { PATHS } from './paths';
import RecommendationPage from '../pages/student/spkstudent/RecommendationPage.tsx';
import RecommendationHistoryPage from '../pages/admin/spkadmin/RecommendationHistoryPage.tsx';


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

        {/* ROLE MENTOR */}
        <Route element={<RoleRoute allowedRoles={['mentor']} />}>
          <Route element={<MentorLayout />}>
            <Route path={PATHS.MENTOR_DASHBOARD} element={<MentorDashboard />} />

            {/* TAMBAHKAN RUTE MENTOR DI SINI  */}
            <Route path={PATHS.MENTOR_CLASS_LIST} element={<MentorClassListPage />} />
            <Route path={PATHS.MENTOR_CLASS_CREATE} element={<MentorClassCreatePage />} />
            <Route path={PATHS.MENTOR_CLASS_EDIT} element={<MentorClassEditPage />} />
            <Route path={PATHS.MENTOR_MATERIAL_LIST} element={<MateriListPage />} />
            <Route path={PATHS.MENTOR_MATERIAL_CREATE} element={<MateriCreatePage />} />
            <Route path={PATHS.MENTOR_MATERIAL_EDIT} element={<MateriEditPage />} />
            <Route path={PATHS.MENTOR_REVIEW_LIST} element={<MentorReview />} />
            <Route path={PATHS.MENTOR_PROFILE} element={<MentorProfile />} />
          </Route>
        </Route>

        {/* ROLE STUDENT */}
        <Route element={<RoleRoute allowedRoles={['siswa']} />}>
          <Route element={<StudentLayout />}>
            <Route path={PATHS.STUDENT_DASHBOARD} element={<StudentDashboard />} />
            <Route path={PATHS.STUDENT_COURSES} element={<MyCoursesPage />} />
            <Route path={PATHS.STUDENT_COURSE_DETAIL} element={<CourseLearningDetailPage />} />
            <Route path={PATHS.STUDENT_MATERIALS} element={<MaterialVideoPage />} />
            <Route path={PATHS.STUDENT_MATERIAL_DETAIL} element={<MaterialVideoPage />} />
            <Route path={PATHS.STUDENT_PROGRESS} element={<LearningProgressPage />} />
            <Route path={PATHS.STUDENT_EXAMS} element={<ExamsGradesPage />} />
            <Route path={PATHS.STUDENT_REVIEWS} element={<ClassReviewPage />} />
            <Route path={PATHS.STUDENT_REVIEW_CREATE} element={<ClassReviewPage />} />
            <Route path={PATHS.STUDENT_PROFILE} element={<ProfilePage />} />
            <Route path={PATHS.RECOMMENDATION} element={<RecommendationPage />} />
            <Route path={PATHS.RECOMMENDATION_HISTORY} element={<RecommendationHistoryPage />} />
          </Route>
        </Route>
        <Route element={<PublicLayout />}>

        </Route>

        {/* ROLE ADMIN */}
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
            <Route path={PATHS.ADMIN_KRITERIA} element={<KriteriaListPage />} />
            <Route path={PATHS.ADMIN_KRITERIA_VALUES} element={<KriteriaValueListPage />} />
            <Route path={PATHS.ADMIN_RECOMMENDATION_ALL} element={<AdminRecommendationListPage />} />
            <Route path={PATHS.RECOMMENDATION} element={<RecommendationPage />} />
            <Route path={PATHS.RECOMMENDATION_DETAIL} element={<AdminRecommendationDetailPageadmin />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}