'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, recordApi, appointmentApi, tokenManager } from '@/lib/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentRecordsList from '@/components/dashboard/RecentRecordsList';
import UpcomingAppointmentsList from '@/components/dashboard/UpcomingAppointmentsList';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Button from '@/components/ui/Button';
import { CalendarIcon, PlusCircleIcon } from '@/components/icons/DashboardIcons';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = tokenManager.get();
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const [profileRes, recordsRes] = await Promise.all([
          authApi.getProfile(token),
          recordApi.getAll(token)
        ]);
        setUser(profileRes.user);
        setRecords(recordsRes.records);
        
        // Try to load appointments
        try {
          const appointmentsRes = await appointmentApi.getAll(token);
          setAppointments(appointmentsRes.appointments || []);
        } catch (err) {
          console.log('Appointments not loaded:', err);
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
        if (error.status === 401) {
          tokenManager.remove();
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const stats = {
    records: records.length,
    appointments: appointments.length,
    familyMembers: 4,
    recentlyAdded: records.filter(r => {
      const date = new Date(r.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length
  };

  return (
    <DashboardLayout user={user}>
      <DashboardHeader
        title={<><span>Welcome back, </span><span className="highlight-teal">{user?.name || 'User'}</span></>}
        subtitle="Here's an overview of your family's health"
        actions={(
          <>
            <Button variant="outline" className="btn-new-appointment">
              <CalendarIcon size={18} />
              New Appointment
            </Button>
            <Button variant="primary" className="btn-add-record">
              <PlusCircleIcon size={18} />
              Add Record
            </Button>
          </>
        )}
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Two Column Layout */}
      <div className="dashboard-two-column">
        <RecentRecordsList initialRecords={records} />
        <UpcomingAppointmentsList appointments={appointments} />
      </div>
    </DashboardLayout>
  );
}
