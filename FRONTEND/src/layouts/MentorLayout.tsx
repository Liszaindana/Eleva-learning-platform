import { Outlet } from 'react-router-dom';

export default function MentorLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
