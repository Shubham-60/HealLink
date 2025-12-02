'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { FileTextIcon, PlusCircleIcon, ChevronLeftIcon } from '@/components/icons/DashboardIcons';

const UploadIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const ExternalLinkIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export default function AddEditRecordForm({ 
  onCancel, 
  onSubmit, 
  initialData = null,
  isEdit = false,
  familyMembers = [],
  submitting = false
}) {
  const [form, setForm] = useState({
    title: '',
    type: '',
    memberId: '',
    doctorName: '',
    date: '',
    notes: '',
  });
  // `files` can contain two kinds of entries:
  // - File objects selected in the browser (new uploads)
  // - Existing file metadata objects returned from the server (existing uploads)
  const [files, setFiles] = useState([]);

  // track existing files that were removed client-side (optional: send to backend)
  const [removedExistingFiles, setRemovedExistingFiles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        type: initialData.type || '',
        memberId: initialData.memberId || '',
        doctorName: initialData.doctorName || '',
        date: initialData.date || '',
        notes: initialData.notes || '',
      });
      // Initialize files with any existing uploaded files from the record
      if (initialData.files && Array.isArray(initialData.files) && initialData.files.length > 0) {
        // keep server file objects as-is but mark them as existing for the UI
        const existing = initialData.files.map(f => ({ ...f, existing: true }));
        setFiles(existing);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const file = prev[index];
      // if it's an existing file object, track it in removedExistingFiles
      if (file && file.existing) {
        setRemovedExistingFiles(prevRem => [...prevRem, file]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.memberId || !form.date) return;
    if (onSubmit) onSubmit({ ...form, files });
  };

  return (
    <div className="record-form-page">
      <button type="button" className="back-link" onClick={onCancel}>
        <ChevronLeftIcon size={18} />
        <span>Back to Records</span>
      </button>

      <div className="form-card">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title-wrapper">
            <div className="section-icon-wrapper">
              <FileTextIcon size={20} />
            </div>
            <div>
              <h2 className="section-title">
                {isEdit ? 'Edit Health Record' : 'Add New Health Record'}
              </h2>
              <p className="section-subtitle">
                {isEdit ? 'Update the details of this health record' : 'Fill in the details to create a new health record'}
              </p>
            </div>
          </div>
        </div>

        <form className="record-form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Record Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Annual Physical Checkup"
              className="input-control"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Record Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input-control"
                required
              >
                <option value="">Select type</option>
                <option value="Checkup">Checkup</option>
                <option value="Prescription">Prescription</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Lab Result">Lab Result</option>
                <option value="Surgery">Surgery</option>
                <option value="Imaging">Imaging</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Family Member</label>
              <select
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                className="input-control"
                required
              >
                <option value="">Select member</option>
                {familyMembers.map((m) => (
                  <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-field">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="input-control"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or details..."
              className="input-control"
              rows={4}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Prescription Files (Optional)</label>
            <div 
              className="file-upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <UploadIcon size={32} />
              <div className="upload-text">
                <p className="upload-title">Click to upload prescription files</p>
                <p className="upload-subtitle">PDF, DOC, DOCX, or Images</p>
              </div>
            </div>
            {files.length > 0 && (
              <div className="uploaded-files-list">
                {files.map((file, index) => (
                  <div key={index} className="uploaded-file-item">
                    {file.existing ? (
                      // existing file metadata from server
                      <>
                        <div className="file-info-wrapper">
                          <FileTextIcon size={20} />
                          <span className="file-name">{file.filename || file.name}</span>
                          {file.size && (
                            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                          )}
                        </div>
                        <div className="file-actions-wrapper">
                          <button
                            type="button"
                            className="view-file-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.path || file.url || '#', '_blank');
                            }}
                            title="View file"
                          >
                            <ExternalLinkIcon size={16} />
                            View
                          </button>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                      </>
                    ) : (
                      // newly selected File object
                      <>
                        <div className="file-info-wrapper">
                          <FileTextIcon size={20} />
                          <span className="file-name">{file.name}</span>
                          {file.size && (
                            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          title="Remove file"
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
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
              {submitting ? 'Saving...' : (isEdit ? 'Update Record' : 'Save Record')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
