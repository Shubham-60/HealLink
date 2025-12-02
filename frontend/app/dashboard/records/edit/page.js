'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddEditRecordForm from '@/components/records/AddEditRecordForm';
import { recordApi, familyMemberApi, tokenManager } from '@/lib/api';

function EditRecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get('id');
  
  const [recordData, setRecordData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recordId) {
      fetchData();
    }
  }, [recordId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const [recordRes, membersRes] = await Promise.all([
        recordApi.get(token, recordId),
        familyMemberApi.getAll(token)
      ]);
      
      const record = recordRes.record;
      setRecordData({
        title: record.title,
        type: record.type,
        memberId: record.member?._id || record.member,
        doctorName: record.doctorName || record.doctor || '',
        date: record.recordDate ? record.recordDate.split('T')[0] : '',
        notes: record.notes || ''
      ,
        // include any uploaded files returned by the backend
        files: record.files || []
      });
      setFamilyMembers(membersRes.members || []);
    } catch (err) {
      console.error('Failed to fetch record:', err);
      alert(err.message || 'Failed to load record data');
      router.push('/dashboard/records');
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
      
      const payload = {
        title: formData.title,
        type: formData.type, // Use as-is, matches backend enum
        member: formData.memberId,
        doctor: formData.doctorName,
        recordDate: formData.date,
        notes: formData.notes || ''
      };
      
      await recordApi.update(token, recordId, payload);
      router.push('/dashboard/records');
    } catch (err) {
      console.error('Failed to update record:', err);
      alert(err.message || 'Failed to update health record');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !recordData) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading record data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AddEditRecordForm
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialData={recordData}
        familyMembers={familyMembers}
        isEdit={true}
        submitting={submitting}
      />
    </DashboardLayout>
  );
}

export default function EditRecordPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    }>
      <EditRecordContent />
    </Suspense>
  );
}
