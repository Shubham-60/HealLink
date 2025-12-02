'use client';
import { UsersIcon } from '@/components/icons/DashboardIcons';

export default function FamilyStatsCard({ totalMembers }) {
  return (
    <div className="family-stats-card">
      <div className="stats-icon-wrapper">
        <UsersIcon size={24} />
      </div>
      <div className="stats-content">
        <p className="stats-label">Total Members</p>
        <h3 className="stats-value">{totalMembers}</h3>
      </div>
    </div>
  );
}
