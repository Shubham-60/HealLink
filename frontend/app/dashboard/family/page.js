'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FamilyStatsCard from '@/components/family/FamilyStatsCard';
import FamilyMemberCard from '@/components/family/FamilyMemberCard';
import Button from '@/components/ui/Button';
import { PlusCircleIcon } from '@/components/icons/DashboardIcons';
import { authApi, familyMemberApi, tokenManager } from '@/lib/api';

export default function FamilyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = tokenManager.get();
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const [profile, membersData] = await Promise.all([
        authApi.getProfile(token),
        familyMemberApi.getAll(token)
      ]);
      setUser(profile.user);
      setFamilyMembers(membersData.members || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Failed to load family members');
      if (err.status === 401) {
        tokenManager.remove();
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    router.push(`/dashboard/family/edit?id=${member._id}`);
  };

  const handleDelete = async (memberId) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    try {
      const token = tokenManager.get();
      await familyMemberApi.remove(token, memberId);
      setFamilyMembers(prev => prev.filter(m => m._id !== memberId));
    } catch (err) {
      console.error('Failed to delete family member:', err);
      alert(err.message || 'Failed to delete family member');
    }
  };

  const handleAddMember = () => {
    router.push('/dashboard/family/add');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading family members...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Family Members"
        subtitle="Manage your family members' profiles"
        actions={(
          <Button
            variant="primary"
            className="btn-add-record"
            onClick={handleAddMember}
          >
            <PlusCircleIcon size={18} />
            Add Member
          </Button>
        )}
      />

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1rem', background: '#fee', borderRadius: '8px', color: '#c00' }}>
          {error}
        </div>
      )}

      {/* Stats Card */}
      <FamilyStatsCard totalMembers={familyMembers.length} />

      {/* Family Members Grid */}
      {familyMembers.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          <p>No family members added yet. Click "Add Member" to get started.</p>
        </div>
      ) : (
        <div className="family-members-grid">
          {familyMembers.map((member) => (
            <FamilyMemberCard
              key={member._id}
              member={member}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
