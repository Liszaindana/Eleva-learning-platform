import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PATHS } from '../../../routes/paths';

export default function ClassEditPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Advanced UI Design Systems');
  const [description, setDescription] = useState('Master the art of creating scalable design systems.');
  const [category, setCategory] = useState('Design');
  const [mentor, setMentor] = useState('Budi Santoso');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(PATHS.ADMIN_CLASS_LIST);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={PATHS.ADMIN_CLASS_LIST} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Course</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Update course details
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
                Course Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                placeholder="e.g. Advanced UI Design Systems"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                placeholder="Course description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label htmlFor="mentor" className="block text-sm font-semibold text-slate-900 mb-2">
                  Mentor
                </label>
                <select
                  id="mentor"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select a mentor</option>
                  <option value="Budi Santoso">Budi Santoso</option>
                  <option value="Sarah Amelia">Sarah Amelia</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit">Update Course</Button>
              <Link to={PATHS.ADMIN_CLASS_LIST}>
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
