'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { authApi, recordApi, tokenManager } from '@/lib/api';
import { 
  ChevronLeftIcon, 
  EditIcon, 
  TrashIcon,
  UserIcon,
  CalendarIcon,
  FileTextIcon,
  StethoscopeIcon
} from '@/components/icons/DashboardIcons';

const CalendarCheckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function RecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id;
  
  const [user, setUser] = useState(null);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = tokenManager.get();
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const [profile, recordData] = await Promise.all([
          authApi.getProfile(token),
          recordApi.get(token, recordId)
        ]);
        setUser(profile.user);
        setRecord(recordData.record);
      } catch (err) {
        console.error('Load error:', err);
        if (err.status === 401) {
          tokenManager.remove();
          router.push('/');
        } else {
          alert('Failed to load record');
          router.push('/dashboard/records');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router, recordId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const token = tokenManager.get();
      await recordApi.remove(token, recordId);
      router.push('/dashboard/records');
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert(err.message || 'Failed to delete record');
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/records/edit?id=${recordId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeBadgeClass = (type) => {
    const classes = {
      'Checkup': 'type-checkup',
      'Prescription': 'type-prescription',
      'Vaccination': 'type-vaccination',
      'Lab Result': 'type-lab',
    };
    return classes[type] || 'type-default';
  };

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading record...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!record) {
    return (
      <DashboardLayout user={user}>
        <div className="error-screen">
          <p>Record not found</p>
          <Button onClick={() => router.push('/dashboard/records')}>
            Back to Records
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="record-detail-container">
        {/* Header */}
        <div className="record-detail-header">
          <button 
            className="back-button"
            onClick={() => router.push('/dashboard/records')}
          >
            <ChevronLeftIcon size={20} />
            <span>Back to Records</span>
          </button>

          <div className="record-detail-actions">
            <Button 
              variant="secondary" 
              onClick={handleEdit}
              className="btn-edit-record"
            >
              <EditIcon size={18} />
              Edit
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
              className="btn-delete-record"
            >
              <TrashIcon size={18} />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="record-detail-content">
          {/* Title Section */}
          <div className="record-detail-title-section">
            <div className="record-icon-container">
              <FileTextIcon size={32} />
            </div>
            <div>
              <h1 className="record-detail-title">{record.title}</h1>
              <span className={`type-badge ${getTypeBadgeClass(record.type)} type-badge-large`}>
                {record.type}
              </span>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="record-info-grid">
            {/* Family Member Card */}
            <div className="record-info-card">
              <div className="info-card-header">
                <UserIcon size={20} className="info-icon" />
                <span className="info-label">Family Member</span>
              </div>
              <div className="info-card-content">
                <h3 className="info-title">{record.member?.name || 'Unknown'}</h3>
                <p className="info-subtitle">{record.member?.relation || 'Self'}</p>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="record-info-card">
              <div className="info-card-header">
                <StethoscopeIcon size={20} className="info-icon" />
                <span className="info-label">Doctor</span>
              </div>
              <div className="info-card-content">
                <h3 className="info-title">{record.doctorName || record.doctor || 'Dr. Amit Singh'}</h3>
              </div>
            </div>

            {/* Date Card */}
            <div className="record-info-card">
              <div className="info-card-header">
                <CalendarIcon size={20} className="info-icon" />
                <span className="info-label">Date</span>
              </div>
              <div className="info-card-content">
                <h3 className="info-title">{formatDate(record.recordDate)}</h3>
              </div>
            </div>

            {/* Created Date Card */}
            <div className="record-info-card">
              <div className="info-card-header">
                <CalendarCheckIcon size={20} className="info-icon" />
                <span className="info-label">Created</span>
              </div>
              <div className="info-card-content">
                <h3 className="info-title">{formatDate(record.createdAt)}</h3>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {record.notes && (
            <div className="record-notes-section">
              <h2 className="section-title">Notes</h2>
              <div className="notes-content">
                <p>{record.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .record-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .record-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .record-detail-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-edit-record,
        .btn-delete-record {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
        }

        .record-detail-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .record-detail-title-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .record-icon-container {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .record-detail-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: white;
        }

        .type-badge-large {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          display: inline-block;
        }

        .record-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          background: #f8fafc;
        }

        .record-info-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .record-info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .info-icon {
          color: #10b981;
        }

        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-card-content {
          margin-top: 0.75rem;
        }

        .info-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .info-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0.25rem 0 0 0;
        }

        .record-notes-section {
          padding: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .notes-content {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          border-left: 4px solid #10b981;
        }

        .notes-content p {
          margin: 0;
          line-height: 1.6;
          color: #475569;
          font-size: 1rem;
        }

        .type-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .type-checkup {
          background: #dbeafe;
          color: #1e40af;
        }

        .type-prescription {
          background: #dcfce7;
          color: #15803d;
        }

        .type-vaccination {
          background: #fed7aa;
          color: #c2410c;
        }

        .type-lab {
          background: #e9d5ff;
          color: #6b21a8;
        }

        .type-default {
          background: #f1f5f9;
          color: #475569;
        }

        .loading-screen,
        .error-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .record-detail-container {
            padding: 1rem;
          }

          .record-detail-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .record-detail-title-section {
            flex-direction: column;
            text-align: center;
          }

          .record-detail-title {
            font-size: 1.5rem;
          }

          .record-info-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
