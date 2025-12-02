'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddEditFamilyMemberForm from '@/components/family/AddEditFamilyMemberForm';
import { familyMemberApi, tokenManager } from '@/lib/api';

function EditFamilyMemberContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get('id');
  
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (memberId) {
      fetchMemberData();
    }
  }, [memberId]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const data = await familyMemberApi.get(token, memberId);
      setMemberData(data.member);
    } catch (err) {
      console.error('Failed to fetch member:', err);
      alert(err.message || 'Failed to load member data');
      router.push('/dashboard/family');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/family');
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const token = tokenManager.get();
      await familyMemberApi.update(token, memberId, formData);
      router.push('/dashboard/family');
    } catch (err) {
      console.error('Failed to update family member:', err);
      alert(err.message || 'Failed to update family member');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !memberData) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading member data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AddEditFamilyMemberForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialData={memberData}
        isEdit={true}
        submitting={submitting}
      />
    </DashboardLayout>
  );
}

export default function EditFamilyMemberPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    }>
      <EditFamilyMemberContent />
    </Suspense>
  );
}
