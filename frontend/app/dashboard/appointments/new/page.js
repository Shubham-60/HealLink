'use client';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ScheduleAppointmentForm from '@/components/appointments/ScheduleAppointmentForm';

export default function NewAppointmentPage() {
  const router = useRouter();

  const handleCancel = () => router.push('/dashboard/appointments');
  const handleSubmit = (form) => {
    // TODO: integrate with backend create appointment API
    console.log('Schedule appointment payload:', form);
    router.push('/dashboard/appointments');
  };

  // TODO: fetch actual family members
  const mockFamily = [
    { id: '1', name: 'Shubham' },
    { id: '2', name: 'Arjun' },
    { id: '3', name: 'Priya' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-content-new">
        <ScheduleAppointmentForm 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          familyMembers={mockFamily}
        />
      </div>
    </DashboardLayout>
  );
}
