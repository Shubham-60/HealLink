'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ScheduleAppointmentForm from '@/components/appointments/ScheduleAppointmentForm';
import { appointmentApi, familyMemberApi, tokenManager } from '@/lib/api';

function EditAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');
  
  const [familyMembers, setFamilyMembers] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId) {
        alert('Appointment ID is missing');
        router.push('/dashboard/appointments');
        return;
      }

      try {
        const token = tokenManager.get();
        if (!token) {
          router.push('/');
          return;
        }
        
        console.log('Fetching appointment:', appointmentId);
        const [membersData, appointmentData] = await Promise.all([
          familyMemberApi.getAll(token),
          appointmentApi.get(token, appointmentId)
        ]);
        
        console.log('Appointment data:', appointmentData);
        setFamilyMembers(membersData.members || []);
        setAppointment(appointmentData.appointment);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        alert(`Failed to load appointment: ${err.message || 'Unknown error'}`);
        router.push('/dashboard/appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, router]);

  const handleCancel = () => router.push('/dashboard/appointments');
  
  const handleSubmit = async (form) => {
    try {
      setSubmitting(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/');
        return;
      }
      
      const appointmentDate = new Date(`${form.date}T${form.time}`);
      
      const payload = {
        member: form.memberId,
        doctor: form.doctorName,
        appointmentDate: appointmentDate.toISOString(),
        status: form.status || 'scheduled',
        notes: form.notes || ''
      };
      
      await appointmentApi.update(token, appointmentId, payload);
      router.push('/dashboard/appointments');
    } catch (err) {
      console.error('Failed to update appointment:', err);
      alert(err.message || 'Failed to update appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!appointment) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Appointment not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ScheduleAppointmentForm 
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        familyMembers={familyMembers}
        submitting={submitting}
        initialData={appointment}
        isEditing={true}
      />
    </DashboardLayout>
  );
}

export default function EditAppointmentPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    }>
      <EditAppointmentContent />
    </Suspense>
  );
}
