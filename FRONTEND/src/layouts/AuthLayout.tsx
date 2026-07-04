import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <Outlet />
      </div>
    </div>
  );
}
