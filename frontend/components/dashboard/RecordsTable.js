'use client';
import { useState } from 'react';
import { recordApi, tokenManager } from '@/lib/api';
import { PlusCircleIcon, EditIcon, TrashIcon, SearchIcon, MoreVerticalIcon } from '../icons/DashboardIcons';
import Button from '../ui/Button';

export default function RecordsTable({ initialRecords = [] }) {
  const [records, setRecords] = useState(initialRecords);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ title: '', type: 'general', notes: '', recordDate: '' });
  const [loading, setLoading] = useState(false);
  const token = tokenManager.get();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createRecord = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setLoading(true);
    try {
      const res = await recordApi.create(token, {
        ...form,
        recordDate: form.recordDate || new Date().toISOString()
      });
      setRecords([res.record, ...records]);
      setForm({ title: '', type: 'general', notes: '', recordDate: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await recordApi.remove(token, id);
      setRecords(records.filter(r => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const typeColors = {
    general: 'blue',
    lab: 'purple',
    prescription: 'green',
    immunization: 'orange'
  };

  return (
    <div className="records-section">
      <div className="records-header">
        <div className="search-bar">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="records-actions">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="lab">Lab</option>
            <option value="prescription">Prescription</option>
            <option value="immunization">Immunization</option>
          </select>
          <Button onClick={() => setShowAddModal(true)} variant="primary">
            <PlusCircleIcon size={18} />
            Add Record
          </Button>
        </div>
      </div>

      <div className="records-grid">
        {filteredRecords.map(record => (
          <div key={record._id} className="record-card">
            <div className="record-card-header">
              <span className={`record-type-badge ${typeColors[record.type]}`}>
                {record.type}
              </span>
              <div className="record-menu">
                <button className="icon-button">
                  <MoreVerticalIcon size={16} />
                </button>
              </div>
            </div>
            <div className="record-card-body">
              <h3 className="record-title">{record.title}</h3>
              <p className="record-date">
                {new Date(record.recordDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {record.notes && <p className="record-notes">{record.notes}</p>}
            </div>
            <div className="record-card-footer">
              <button className="record-action-btn edit">
                <EditIcon size={16} />
                Edit
              </button>
              <button 
                className="record-action-btn delete"
                onClick={() => deleteRecord(record._id)}
              >
                <TrashIcon size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {!filteredRecords.length && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No records found</h3>
            <p>Start by adding your first health record</p>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Health Record</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">×</button>
            </div>
            <form onSubmit={createRecord} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  name="title"
                  placeholder="e.g., Annual Checkup"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="form-input">
                  <option value="general">General</option>
                  <option value="lab">Lab Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="immunization">Immunization</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="recordDate"
                  value={form.recordDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  placeholder="Additional details..."
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  className="form-input"
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <Button type="submit" variant="primary" loading={loading}>
                  Add Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
