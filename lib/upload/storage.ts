/**
 * Storage abstraction — uses Cloudinary for file uploads.
 * Falls back to URL strings if Cloudinary is not configured.
 */
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!process.env.CLOUDINARY_CLOUD_NAME) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

export async function uploadFile(
  buffer: Buffer,
  options: {
    filename: string;
    folder?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
  }
): Promise<UploadResult> {
  ensureConfigured();

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `orbyn/${options.folder || 'uploads'}`,
        resource_type: options.resourceType || 'auto',
        public_id: options.filename.replace(/\.[^.]+$/, ''),
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          duration: (result as any).duration,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFile(publicId: string): Promise<void> {
  ensureConfigured();
  if (!process.env.CLOUDINARY_CLOUD_NAME) return;
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
} = {}): string {
  ensureConfigured();
  if (!process.env.CLOUDINARY_CLOUD_NAME) return '';
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: 'fill',
        quality: options.quality || 'auto',
        fetch_format: 'auto',
      },
    ],
  });
}

export function isStorageConfigured(): boolean {
  return !!process.env.CLOUDINARY_CLOUD_NAME;
}
