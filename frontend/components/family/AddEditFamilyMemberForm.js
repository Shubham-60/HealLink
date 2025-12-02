'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { CalendarIcon, PlusCircleIcon, ChevronLeftIcon, UsersIcon } from '@/components/icons/DashboardIcons';

export default function AddEditFamilyMemberForm({ 
  onCancel, 
  onSubmit, 
  initialData = null,
  isEdit = false,
  submitting = false
}) {
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        relationship: initialData.relationship || '',
        dateOfBirth: initialData.dateOfBirth || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.relationship || !form.dateOfBirth) return;
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="family-form-page">
      <button type="button" className="back-link" onClick={onCancel}>
        <ChevronLeftIcon size={18} />
        <span>Back to Family Members</span>
      </button>

      <div className="form-card">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title-wrapper">
            <div className="section-icon-wrapper">
              <UsersIcon size={20} />
            </div>
            <div>
              <h2 className="section-title">
                {isEdit ? 'Edit Family Member' : 'Add New Family Member'}
              </h2>
              <p className="section-subtitle">
                Fill in the details to {isEdit ? 'update the' : 'add a new'} family member
              </p>
            </div>
          </div>
        </div>

        <form className="family-form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Shubham Kumar"
              className="input-control"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Relationship</label>
            <select
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
              className="input-control"
              required
            >
              <option value="">Select relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Grandfather">Grandfather</option>
              <option value="Grandmother">Grandmother</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="input-control"
              required
            />
          </div>

          <div className="form-actions">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel} 
              className="btn-cancel"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              <PlusCircleIcon size={18} />
              {submitting ? 'Saving...' : (isEdit ? 'Update Member' : 'Add Member')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
