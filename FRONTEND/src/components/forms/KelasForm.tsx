import type { Class } from '../../types/learning';

interface KelasFormProps {
  kelas?: Class;
  onSubmit: (title: string, description: string) => void;
}

export default function KelasForm({ kelas, onSubmit }: KelasFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const title = String(formData.get('title') || '').trim();
        const description = String(formData.get('description') || '').trim();
        onSubmit(title, description);
      }}
    >
      <label className="block text-sm font-medium text-slate-700">
        Judul Kelas
        <input
          name="title"
          defaultValue={kelas?.title ?? ''}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Masukkan judul kelas"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Deskripsi Kelas
        <textarea
          name="description"
          defaultValue={kelas?.description ?? ''}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Masukkan deskripsi kelas"
          rows={5}
        />
      </label>
      <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
        Simpan Kelas
      </button>
    </form>
  );
}
