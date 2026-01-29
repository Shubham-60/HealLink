/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.45 MB", "512.30 KB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Show in MB if >= 1MB, otherwise in KB
  if (i >= 2) {
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  } else if (i >= 1) {
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  return bytes + ' Bytes';
};

/**
 * Validate if file size is within limits
 * @param {number} fileSizeBytes - File size in bytes
 * @param {number} maxSizeMB - Maximum file size in MB (default: 10)
 * @returns {object} { valid: boolean, error: string }
 */
export const validateFileSize = (fileSizeBytes, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (fileSizeBytes > maxSizeBytes) {
    return {
      valid: false,
      error: `File size (${formatFileSize(fileSizeBytes)}) exceeds maximum limit of ${maxSizeMB} MB`
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate multiple files
 * @param {File[]} files - Array of File objects
 * @param {number} maxSizeMB - Maximum file size in MB per file
 * @returns {object} { validFiles: [], invalidFiles: [] }
 */
export const validateFiles = (files, maxSizeMB = 10) => {
  const validFiles = [];
  const invalidFiles = [];

  files.forEach(file => {
    const validation = validateFileSize(file.size, maxSizeMB);
    if (validation.valid) {
      validFiles.push(file);
    } else {
      invalidFiles.push({
        filename: file.name,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        error: validation.error
      });
    }
  });

  return { validFiles, invalidFiles };
};
