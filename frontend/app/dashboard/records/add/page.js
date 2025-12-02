'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddEditRecordForm from '@/components/records/AddEditRecordForm';
import { recordApi, familyMemberApi, tokenManager } from '@/lib/api';

export default function AddRecordPage() {
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

  const handleCancel = () => {
    router.push('/dashboard/records');
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      const payload = {
        title: formData.title,
        type: formData.type, // Use as-is, matches backend enum
        member: formData.memberId,
        doctor: formData.doctorName,
        recordDate: formData.date,
        notes: formData.notes || ''
      };
      
      // TODO: Handle file uploads when backend supports it
      await recordApi.create(token, payload);
      router.push('/dashboard/records');
    } catch (err) {
      console.error('Failed to add record:', err);
      alert(err.message || 'Failed to add health record');
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
      <AddEditRecordForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        familyMembers={familyMembers}
        isEdit={false}
        submitting={submitting}
      />
    </DashboardLayout>
  );
}
