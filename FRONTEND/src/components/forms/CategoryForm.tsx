import type { Category } from '../../types/learning';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (name: string) => void;
}

export default function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const name = String(formData.get('name') || '').trim();
        onSubmit(name);
      }}
    >
      <label className="block text-sm font-medium text-slate-700">
        Nama Kategori
        <input
          name="name"
          defaultValue={category?.categories ?? ''}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Masukkan nama kategori"
        />
      </label>
      <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
        Simpan Kategori
      </button>
    </form>
  );
}
