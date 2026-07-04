import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
