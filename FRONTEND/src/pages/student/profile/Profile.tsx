import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'S';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile settings saved successfully!');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information and preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <span className="text-3xl font-extrabold text-white">{firstLetter}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Siswa'}</h2>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">{user?.role || 'Student'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium cursor-not-allowed text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="tel"
              defaultValue="+62 812 3456 7890"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bio</label>
            <textarea
              rows={3}
              defaultValue="Learning, growing, and building the future with Eleva learning platform."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium text-sm transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button type="submit" className="text-xs font-bold">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}