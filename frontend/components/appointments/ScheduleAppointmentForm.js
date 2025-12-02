'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CalendarIcon, PlusCircleIcon, ChevronLeftIcon, EditIcon } from '@/components/icons/DashboardIcons';

export default function ScheduleAppointmentForm({ onCancel, onSubmit, familyMembers = [], submitting = false, initialData = null, isEditing = false }) {
  const [form, setForm] = useState({
    memberId: '',
    doctorName: '',
    date: '',
    time: '',
    notes: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (initialData) {
      const appointmentDate = new Date(initialData.appointmentDate);
      const dateStr = appointmentDate.toISOString().split('T')[0];
      const timeStr = appointmentDate.toTimeString().slice(0, 5);
      
      setForm({
        memberId: initialData.member?._id || '',
        doctorName: initialData.doctor || '',
        date: dateStr,
        time: timeStr,
        notes: initialData.notes || '',
        status: initialData.status || 'scheduled',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.memberId || !form.doctorName || !form.date || !form.time) return;
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="appointment-page">
      <button type="button" className="back-link" onClick={onCancel}>
        <ChevronLeftIcon size={18} />
        <span>Back to Appointments</span>
      </button>

      <div className="form-card">
      <div className="section-header" style={{ marginBottom: '1rem' }}>
        <div className="section-title-wrapper">
          <div className="section-icon-wrapper">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="section-title">{isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
            <p className="section-subtitle">{isEditing ? 'Update the appointment details' : 'Fill in the details to schedule a new appointment'}</p>
          </div>
        </div>
      </div>

      <form className="appointment-form-grid" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Family Member</label>
            <select
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              className="input-control"
            >
              <option value="">Select member</option>
              {familyMembers.map((m) => (
                <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Doctor Name</label>
            <input
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              placeholder="e.g., Dr. Rajesh Kumar"
              className="input-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input-control"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="input-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field" style={{ width: '100%' }}>
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any notes about this appointment..."
              className="input-control"
              rows={4}
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-control"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}

        <div className="header-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" type="button" onClick={onCancel} className="btn-new-appointment" disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="btn-add-record" disabled={submitting}>
            {isEditing ? <EditIcon size={18} /> : <PlusCircleIcon size={18} />}
            {submitting ? (isEditing ? 'Updating...' : 'Scheduling...') : (isEditing ? 'Update Appointment' : 'Schedule Appointment')}
          </Button>
        </div>
      </form>
      </div>


    </div>
  );
}
