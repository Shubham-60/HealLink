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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const recordsPerPage = 5;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRecords = async () => {
    const token = tokenManager.get();
    if (!token) {
      router.push('/');
      return;
    }
    
    try {
      setLoading(true);
      const params = {
        search: debouncedSearchTerm || undefined,
        member: memberFilter !== 'all' ? memberFilter : undefined,
        sort: sortOrder,
        page: currentPage,
        limit: recordsPerPage
      };
      
      const recordsData = await recordApi.getAll(token, params);
      setRecords(recordsData.records || []);
      setPagination(recordsData.pagination || { total: 0, pages: 0 });
    } catch (err) {
      console.error('Load records error:', err);
      if (err.status === 401) {
        tokenManager.remove();
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      const token = tokenManager.get();
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const [profile, membersData] = await Promise.all([
          authApi.getProfile(token),
          familyMemberApi.getAll(token)
        ]);
        setUser(profile.user);
        setFamilyMembers(membersData.members || []);
      } catch (err) {
        console.error('Load error:', err);
        if (err.status === 401) {
          tokenManager.remove();
          router.push('/');
        }
      }
    };
    loadInitial();
  }, [router]);

  useEffect(() => {
    fetchRecords();
  }, [debouncedSearchTerm, memberFilter, sortOrder, currentPage]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      const token = tokenManager.get();
      await recordApi.remove(token, id);
      // Refresh records after deletion
      fetchRecords();
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert(err.message || 'Failed to delete record');
    }
  };

  const handleView = (id) => {
    router.push(`/dashboard/records/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/records/edit?id=${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleMemberFilterChange = (e) => {
    setMemberFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
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
            onChange={handleSearchChange}
            className="search-input-records"
          />
        </div>
        <div className="filters-wrapper">
          <select
            value={memberFilter}
            onChange={handleMemberFilterChange}
            className="filter-select-records"
          >
            <option value="all">All Members</option>
            {familyMembers.map(member => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={handleSortChange}
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
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">No records found</td>
              </tr>
            ) : (
              records.map((record) => (
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
        {pagination.total > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, pagination.total)} of {pagination.total} records
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon size={16} />
                Previous
              </button>
              <span className="pagination-pages">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
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
