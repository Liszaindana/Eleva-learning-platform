import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PATHS } from '../../../routes/paths';

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('Programming');
  const [description, setDescription] = useState('Learn coding and development');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(PATHS.ADMIN_CATEGORY_LIST);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={PATHS.ADMIN_CATEGORY_LIST} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Category</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Update category details
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Category Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                placeholder="e.g. Programming"
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
                placeholder="Brief description of the category"
                required
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit">Update Category</Button>
              <Link to={PATHS.ADMIN_CATEGORY_LIST}>
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
