'use client';
import { useState } from 'react';
import { FileTextIcon, ActivityIcon } from '../icons/DashboardIcons';
import { StethoscopeIcon } from '../icons/HealthcareIcons';

export default function RecentRecordsList({ initialRecords = [] }) {
  const [records] = useState(initialRecords.slice(0, 5));

  const getRecordIcon = (type) => {
    const icons = {
      general: StethoscopeIcon,
      lab: ActivityIcon,
      prescription: FileTextIcon,
      immunization: FileTextIcon
    };
    return icons[type] || FileTextIcon;
  };

  const getIconColor = (type) => {
    const colors = {
      general: { bg: 'rgba(23, 195, 178, 0.15)', color: '#17C3B2' },
      lab: { bg: 'rgba(147, 51, 234, 0.15)', color: '#9333EA' },
      prescription: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' },
      immunization: { bg: 'rgba(249, 115, 22, 0.15)', color: '#F97316' }
    };
    return colors[type] || { bg: 'rgba(23, 195, 178, 0.15)', color: '#17C3B2' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="records-list-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="section-icon-wrapper">
            <FileTextIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">Recent Records</h2>
            <p className="section-subtitle">Last 5 health records added</p>
          </div>
        </div>
        <button className="view-all-link">
          View All <span className="arrow-right">→</span>
        </button>
      </div>

      <div className="records-list">
        {records.length > 0 ? (
          records.map((record) => {
            const iconStyle = getIconColor(record.type);
                        const Icon = getRecordIcon(record.type);
            return (
              <div key={record._id} className="record-list-item">
                <div 
                  className="record-icon-circle"
                  style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
                >
                  <Icon size={20} />
                </div>
                <div className="record-info">
                  <h3 className="record-list-title">{record.title}</h3>
                  <p className="record-list-meta">
                    {record.doctor || 'No doctor specified'} • Dr. {record.notes?.split(' ')[0] || 'General'}
                  </p>
                </div>
                <div className="record-date">
                  {formatDate(record.recordDate || record.createdAt)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-list-state">
            <p>No records yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
