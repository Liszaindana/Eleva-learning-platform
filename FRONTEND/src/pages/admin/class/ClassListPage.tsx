import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { PATHS } from '../../../routes/paths';

const courses = [
  { id: 1, title: 'Advanced UI Design Systems', category: 'Design', mentor: 'Budi Santoso', students: 342, rating: 4.9, status: 'Active' },
  { id: 2, title: 'Product Management 101', category: 'Business', mentor: 'Sarah Amelia', students: 215, rating: 4.8, status: 'Active' },
];

export default function ClassListPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Courses</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage all courses on the platform
            </p>
          </div>
          <Link to={PATHS.ADMIN_CLASS_CREATE}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Course
                </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mentor
                </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Students
                </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rating
                </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{course.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{course.mentor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{course.students}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{course.rating}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{course.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
