'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { FileTextIcon, PlusCircleIcon, ChevronLeftIcon } from '@/components/icons/DashboardIcons';
import { uploadFilesSequentially, retryFileUpload } from '@/lib/cloudinaryUpload';
import { Progress } from '@/components/ui/Progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { formatFileSize, validateFiles } from '@/lib/fileValidation';

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

const AlertCircle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
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

  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  // File validation and errors
  const [fileValidationErrors, setFileValidationErrors] = useState([]);
  const MAX_FILE_SIZE_MB = 10;
  const [isDragging, setIsDragging] = useState(false);

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
    const { validFiles, invalidFiles } = validateFiles(selectedFiles, MAX_FILE_SIZE_MB);
    
    // Set validation errors
    if (invalidFiles.length > 0) {
      setFileValidationErrors(invalidFiles);
    } else {
      setFileValidationErrors([]);
    }
    
    // Add only valid files
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const { validFiles, invalidFiles } = validateFiles(droppedFiles, MAX_FILE_SIZE_MB);
    
    // Set validation errors
    if (invalidFiles.length > 0) {
      setFileValidationErrors(invalidFiles);
    } else {
      setFileValidationErrors([]);
    }
    
    // Add only valid files
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
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

  const handleRetryUpload = async (failedFile) => {
    const fileToRetry = files.find(f => f.name === failedFile.filename);
    if (!fileToRetry) return;

    try {
      setUploadProgress(prev => ({
        ...prev,
        [failedFile.filename]: { progress: 0, status: 'uploading' }
      }));

      const uploadedFile = await retryFileUpload(fileToRetry, (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [failedFile.filename]: { progress, status: 'uploading' }
        }));
      });

      setUploadedFiles(prev => [...prev, uploadedFile]);
      setFailedFiles(prev => prev.filter(f => f.filename !== failedFile.filename));
      setUploadProgress(prev => ({
        ...prev,
        [failedFile.filename]: { progress: 100, status: 'complete' }
      }));
    } catch (error) {
      setUploadProgress(prev => ({
        ...prev,
        [failedFile.filename]: { progress: 0, status: 'failed', error: error.message }
      }));
    }
  };

  const handleRetryAllFailed = async () => {
    if (failedFiles.length === 0) return;

    const filesToRetry = failedFiles.map(f => 
      files.find(file => file.name === f.filename)
    ).filter(Boolean);

    const results = await uploadFilesSequentially(filesToRetry, (filename, progress, status, error) => {
      setUploadProgress(prev => ({
        ...prev,
        [filename]: { progress, status, error }
      }));
    });

    setUploadedFiles(prev => [...prev, ...results.successful]);
    setFailedFiles(results.failed);
  };

  const handleSubmitWithPartial = async () => {
    if (!form.title || !form.type || !form.memberId || !form.date) return;

    // Combine existing files (not removed) with newly uploaded files
    const finalFiles = [
      ...files.filter(f => f.existing && !removedExistingFiles.find(r => r._id === f._id)),
      ...uploadedFiles
    ];

    if (onSubmit) {
      onSubmit({ ...form, files: finalFiles, filesToDelete: removedExistingFiles });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.memberId || !form.date) return;

    // Get new files (not existing ones)
    const newFiles = files.filter(f => !f.existing);

    if (newFiles.length > 0) {
      // Upload files to Cloudinary
      setIsUploading(true);
      setUploadProgress({});
      setUploadedFiles([]);
      setFailedFiles([]);

      const results = await uploadFilesSequentially(newFiles, (filename, progress, status, error) => {
        setUploadProgress(prev => ({
          ...prev,
          [filename]: { progress, status, error }
        }));
      });

      setUploadedFiles(results.successful);
      setFailedFiles(results.failed);
      setIsUploading(false);

      // If there are failed files, show warning but allow submission
      if (results.failed.length > 0) {
        setShowSubmitWarning(true);
        return;
      }

      // All files uploaded successfully, submit the form
      handleSubmitWithPartial();
    } else {
      // No new files to upload, submit directly
      handleSubmitWithPartial();
    }
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
              className={`file-upload-area ${isDragging ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
                <p className="upload-title">{isDragging ? 'Drop files here...' : 'Click to upload prescription files'}</p>
                <p className="upload-subtitle">{isDragging ? 'Release to upload' : 'PDF, DOC, DOCX, or Images (Max 10MB per file)'}</p>
              </div>
            </div>

            {/* File validation errors */}
            {fileValidationErrors.length > 0 && (
              <Alert variant="destructive" style={{ marginBottom: '1rem' }}>
                <AlertCircle style={{ width: '16px', height: '16px' }} />
                <AlertTitle>File Size Error</AlertTitle>
                <AlertDescription>
                  <ul style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {fileValidationErrors.map((error, index) => (
                      <li key={index} style={{ fontSize: '0.875rem' }}>
                        <strong>{error.filename}</strong> ({error.formattedSize}) - {error.error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            {files.length > 0 && (
              <div className="uploaded-files-list">
                {files.map((file, index) => {
                  const fileName = file.name || file.filename;
                  const progress = uploadProgress[fileName];
                  
                  return (
                  <div key={index} className="uploaded-file-item">
                    {file.existing ? (
                      // existing file metadata from server
                      <>
                        <div className="file-info-wrapper">
                          <FileTextIcon size={20} />
                          <span className="file-name">{file.filename || file.name}</span>
                          {file.size && (
                            <span className="file-size">({formatFileSize(file.size)})</span>
                          )}
                        </div>
                        <div className="file-actions-wrapper">
                          <button
                            type="button"
                            className="view-file-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.cloudinaryUrl || file.path || file.url || '#', '_blank');
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
                            <span className="file-size">({formatFileSize(file.size)})</span>
                          )}
                          {progress && (
                            <span className={`upload-status ${progress.status}`}>
                              {progress.status === 'uploading' && `${Math.round(progress.progress)}%`}
                              {progress.status === 'complete' && '✓ Uploaded'}
                              {progress.status === 'failed' && '✗ Failed'}
                            </span>
                          )}
                        </div>
                        {progress && progress.status === 'uploading' && (
                          <div className="progress-wrapper">
                            <Progress value={Math.round(progress.progress)} />
                            <span className="progress-text">{Math.round(progress.progress)}%</span>
                          </div>
                        )}
                        {progress && progress.status === 'failed' && (
                          <button
                            type="button"
                            className="retry-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryUpload({ filename: file.name });
                            }}
                            title="Retry upload"
                          >
                            Retry
                          </button>
                        )}
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          title="Remove file"
                          disabled={progress?.status === 'uploading'}
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
            
            {/* Failed files warning and actions */}
            {showSubmitWarning && failedFiles.length > 0 && (
              <Alert variant="destructive" style={{ marginTop: '1rem' }}>
                <AlertCircle style={{ width: '16px', height: '16px' }} />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>
                  <p style={{ marginBottom: '0.75rem' }}>{failedFiles.length} file(s) failed to upload:</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    {failedFiles.map((f, idx) => (
                      <li key={idx} style={{ fontSize: '0.875rem' }}>
                        <strong>{f.filename}</strong> - {f.error}
                      </li>
                    ))}
                  </ul>
                  <div className="warning-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetryAllFailed}
                      className="btn-retry-all"
                    >
                      Retry All Failed
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSubmitWithPartial}
                      className="btn-submit-anyway"
                    >
                      Submit Anyway ({uploadedFiles.length} files)
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="form-actions">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel} 
              className="btn-cancel"
              disabled={submitting || isUploading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="btn-submit"
              disabled={submitting || isUploading || showSubmitWarning}
            >
              <PlusCircleIcon size={18} />
              {isUploading ? 'Uploading...' : submitting ? 'Saving...' : (isEdit ? 'Update Record' : 'Save Record')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
