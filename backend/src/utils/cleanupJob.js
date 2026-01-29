const cron = require("node-cron");
const cloudinary = require("../config/cloudinary.js");
const HealthRecord = require("../models/HealthRecord.js");

const GRACE_PERIOD_HOURS = parseInt(process.env.CLOUDINARY_CLEANUP_GRACE_HOURS) || 48;

/**
 * Find orphaned files in Cloudinary that don't exist in any database record
 * Files older than the grace period will be deleted
 */
const cleanupOrphanedFiles = async () => {
  try {
    console.log(`[Cleanup Job] Starting orphaned file cleanup (grace period: ${GRACE_PERIOD_HOURS} hours)...`);
    
    const graceTimestamp = new Date(Date.now() - GRACE_PERIOD_HOURS * 60 * 60 * 1000);
    
    // Get all Cloudinary files in the heallink/records folder
    let allCloudinaryFiles = [];
    let nextCursor = null;
    
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'heallink/records',
        max_results: 500,
        next_cursor: nextCursor
      });
      
      allCloudinaryFiles = allCloudinaryFiles.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);
    
    console.log(`[Cleanup Job] Found ${allCloudinaryFiles.length} files in Cloudinary`);
    
    // Get all public IDs from database records
    const allRecords = await HealthRecord.find({}, 'files');
    const dbPublicIds = new Set();
    
    allRecords.forEach(record => {
      if (record.files && Array.isArray(record.files)) {
        record.files.forEach(file => {
          if (file.cloudinaryPublicId) {
            dbPublicIds.add(file.cloudinaryPublicId);
          }
        });
      }
    });
    
    console.log(`[Cleanup Job] Found ${dbPublicIds.size} files referenced in database`);
    
    // Find orphaned files older than grace period
    const orphanedFiles = allCloudinaryFiles.filter(file => {
      const isOrphaned = !dbPublicIds.has(file.public_id);
      const uploadTime = new Date(file.created_at);
      const isOldEnough = uploadTime < graceTimestamp;
      
      return isOrphaned && isOldEnough;
    });
    
    console.log(`[Cleanup Job] Found ${orphanedFiles.length} orphaned files to delete`);
    
    if (orphanedFiles.length === 0) {
      console.log(`[Cleanup Job] No orphaned files to clean up`);
      return {
        success: true,
        deleted: 0,
        failed: 0
      };
    }
    
    // Delete orphaned files from Cloudinary
    const deletionResults = await Promise.allSettled(
      orphanedFiles.map(file => 
        cloudinary.uploader.destroy(file.public_id)
          .then(() => {
            console.log(`[Cleanup Job] Deleted: ${file.public_id}`);
            return { success: true, publicId: file.public_id };
          })
          .catch(err => {
            console.error(`[Cleanup Job] Failed to delete ${file.public_id}:`, err);
            return { success: false, publicId: file.public_id, error: err.message };
          })
      )
    );
    
    const successCount = deletionResults.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failedCount = deletionResults.length - successCount;
    
    console.log(`[Cleanup Job] Completed: ${successCount} deleted, ${failedCount} failed`);
    
    return {
      success: true,
      deleted: successCount,
      failed: failedCount
    };
  } catch (error) {
    console.error("[Cleanup Job] Error during cleanup:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Schedule the cleanup job to run daily at 2 AM
 */
const scheduleCleanupJob = () => {
  // Run daily at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cleanup Job] Running scheduled cleanup at', new Date().toISOString());
    await cleanupOrphanedFiles();
  });
  
  console.log(`[Cleanup Job] Scheduled to run daily at 2:00 AM (grace period: ${GRACE_PERIOD_HOURS} hours)`);
};

module.exports = { scheduleCleanupJob, cleanupOrphanedFiles };
