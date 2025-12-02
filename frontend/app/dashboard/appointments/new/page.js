'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ScheduleAppointmentForm from '@/components/appointments/ScheduleAppointmentForm';
import { appointmentApi, familyMemberApi, tokenManager } from '@/lib/api';

export default function NewAppointmentPage() {
  const router = useRouter();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const data = await familyMemberApi.getAll(token);
      setFamilyMembers(data.members || []);
    } catch (err) {
      console.error('Failed to fetch family members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push('/dashboard/appointments');
  
  const handleSubmit = async (form) => {
    try {
      setSubmitting(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      // Combine date and time into appointmentDate
      const appointmentDate = new Date(`${form.date}T${form.time}`);
      
      const payload = {
        member: form.memberId,
        doctor: form.doctorName,
        appointmentDate: appointmentDate.toISOString(),
        status: 'scheduled',
        notes: form.notes || ''
      };
      
      await appointmentApi.create(token, payload);
      router.push('/dashboard/appointments');
    } catch (err) {
      console.error('Failed to create appointment:', err);
      alert(err.message || 'Failed to schedule appointment');
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

  return (
    <DashboardLayout>
      <ScheduleAppointmentForm 
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        familyMembers={familyMembers}
        submitting={submitting}
      />
    </DashboardLayout>
  );
}
