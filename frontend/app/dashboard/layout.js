'use client';
import TopNavigation from '@/components/dashboard/TopNavigation';
import { UserProvider } from '@/components/auth/UserProvider';

export default function DashboardSectionLayout({ children }) {
  return (
    <UserProvider>
      <div className="dashboard-wrapper">
        <TopNavigation />
        <main className="dashboard-main-new">
          <div className="dashboard-content-new">
            {children}
          </div>
        </main>
      </div>
    </UserProvider>
  );
}
