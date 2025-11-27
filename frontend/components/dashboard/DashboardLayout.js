'use client';
import TopNavigation from './TopNavigation';
import { tokenManager } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ user, children }) {
  const router = useRouter();

  const handleLogout = () => {
    tokenManager.remove();
    router.push('/');
  };

  return (
    <div className="dashboard-wrapper">
      <TopNavigation user={user} onLogout={handleLogout} />
      <main className="dashboard-main-new">
        <div className="dashboard-content-new">
          {children}
        </div>
      </main>
    </div>
  );
}
