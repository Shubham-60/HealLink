'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddEditFamilyMemberForm from '@/components/family/AddEditFamilyMemberForm';
import { familyMemberApi, tokenManager } from '@/lib/api';

export default function AddFamilyMemberPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    router.push('/dashboard/family');
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      await familyMemberApi.create(token, formData);
      router.push('/dashboard/family');
    } catch (err) {
      console.error('Failed to add family member:', err);
      alert(err.message || 'Failed to add family member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <AddEditFamilyMemberForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isEdit={false}
        submitting={submitting}
      />
    </DashboardLayout>
  );
}
