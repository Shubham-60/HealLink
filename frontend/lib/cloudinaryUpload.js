/**
 * Cloudinary Upload Utility
 * Handles sequential file uploads to Cloudinary with progress tracking and retry logic
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Upload a single file to Cloudinary with retry logic
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for progress updates (0-100)
 * @returns {Promise<Object>} - File metadata from Cloudinary
 */
export const uploadFileWithRetry = async (file, onProgress = null) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "heallink/records");

      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              onProgress(percentComplete);
            }
          });
        }

        // Handle load
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                filename: response.original_filename || file.name,
                cloudinaryUrl: response.secure_url,
                cloudinaryPublicId: response.public_id,
                mimetype: file.type,
                size: file.size,
              });
            } catch (error) {
              reject(new Error("Failed to parse Cloudinary response"));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.error?.message || "Upload failed"));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        // Handle error
        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        // Handle abort
        xhr.addEventListener("abort", () => {
          reject(new Error("Upload aborted"));
        });

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
        xhr.send(formData);
      });
    } catch (error) {
      lastError = error;

      // If this is not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES) {
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error("Upload failed after multiple retries");
};

/**
 * Upload multiple files sequentially to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @param {Function} onFileProgress - Callback for individual file progress (filename, progress, status)
 * @returns {Promise<Object>} - { successful: [], failed: [] }
 */
export const uploadFilesSequentially = async (files, onFileProgress = null) => {
  const results = {
    successful: [],
    failed: [],
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      if (onFileProgress) {
        onFileProgress(file.name, 0, "uploading");
      }

      const fileData = await uploadFileWithRetry(file, (progress) => {
        if (onFileProgress) {
          onFileProgress(file.name, progress, "uploading");
        }
      });

      results.successful.push(fileData);

      if (onFileProgress) {
        onFileProgress(file.name, 100, "complete");
      }
    } catch (error) {
      results.failed.push({
        filename: file.name,
        error: error.message,
      });

      if (onFileProgress) {
        onFileProgress(file.name, 0, "failed", error.message);
      }
    }
  }

  return results;
};

/**
 * Retry upload for a single file
 * @param {File} file - The file to retry uploading
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<Object>} - File metadata from Cloudinary
 */
export const retryFileUpload = async (file, onProgress = null) => {
  return uploadFileWithRetry(file, onProgress);
};
