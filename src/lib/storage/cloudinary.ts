import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * @param buffer - File buffer
 * @param folder - Cloudinary folder path (e.g. 'nexfund/trade-licenses')
 * @param fileName - Original file name for reference
 * @returns Secure URL of the uploaded file
 */
export async function uploadDocument(
  buffer: Buffer,
  folder: string = 'nexfund/documents',
  fileName?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: fileName ? fileName.replace(/\.[^.]+$/, '') : undefined,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload returned no result'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by public ID.
 */
export async function deleteDocument(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Generate a client-side upload signature for unsigned uploads.
 * Use the CLOUDINARY_UPLOAD_PRESET env var for unsigned preset name.
 */
export function getUploadConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'nexfund_docs',
  };
}

export default cloudinary;
