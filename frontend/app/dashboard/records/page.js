'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Button from '@/components/ui/Button';
import { 
  PlusCircleIcon, 
  SearchIcon, 
  FileTextIcon, 
  EditIcon, 
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@/components/icons/DashboardIcons';
import { authApi, recordApi, familyMemberApi, tokenManager } from '@/lib/api';

const EyeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function HealthRecordsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      const token = tokenManager.get();
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const [profile, recordsData, membersData] = await Promise.all([
          authApi.getProfile(token),
          recordApi.getAll(token),
          familyMemberApi.getAll(token)
        ]);
        setUser(profile.user);
        setRecords(recordsData.records || []);
        setFamilyMembers(membersData.members || []);
        setFilteredRecords(recordsData.records || []);
      } catch (err) {
        console.error('Load error:', err);
        if (err.status === 401) {
          tokenManager.remove();
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  useEffect(() => {
    let filtered = [...records];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.doctorName && r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Member filter
    if (memberFilter !== 'all') {
      filtered = filtered.filter(r => r.member?._id === memberFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.recordDate);
      const dateB = new Date(b.recordDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [searchTerm, memberFilter, sortOrder, records]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      const token = tokenManager.get();
      await recordApi.remove(token, id);
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert(err.message || 'Failed to delete record');
    }
  };

  const handleView = (id) => {
    console.log('View record:', id);
    // TODO: Navigate to view page or open modal
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/records/edit?id=${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

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
          <p>Loading records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <DashboardHeader
        title="Health Records"
        subtitle="Manage and track all family health records"
        actions={(
          <Button
            variant="primary"
            className="btn-add-record"
            onClick={() => router.push('/dashboard/records/add')}
          >
            <PlusCircleIcon size={18} />
            Add New Record
          </Button>
        )}
      />

      {/* Search and Filters */}
      <div className="records-controls">
        <div className="search-wrapper">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-records"
          />
        </div>
        <div className="filters-wrapper">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="filter-select-records"
          >
            <option value="all">All Members</option>
            {familyMembers.map(member => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select-records"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="records-table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Member</th>
              <th>Doctor</th>
              <th>Date</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">No records found</td>
              </tr>
            ) : (
              currentRecords.map((record) => (
                <tr key={record._id} className="record-row">
                  <td className="record-title">{record.title}</td>
                  <td>
                    <span className={`type-badge ${getTypeBadgeClass(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td>{record.member?.name || 'Unknown'}</td>
                  <td>{record.doctorName || record.doctor || '-'}</td>
                  <td>{formatDate(record.recordDate)}</td>
                  <td className="actions-cell">
                    <div className="record-actions">
                      <button 
                        className="action-icon-btn view-btn"
                        onClick={() => handleView(record._id)}
                        title="View"
                      >
                        <EyeIcon size={18} />
                      </button>
                      <button 
                        className="action-icon-btn edit-btn"
                        onClick={() => handleEdit(record._id)}
                        title="Edit"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button 
                        className="action-icon-btn delete-btn"
                        onClick={() => handleDelete(record._id)}
                        title="Delete"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredRecords.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon size={16} />
                Previous
              </button>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
