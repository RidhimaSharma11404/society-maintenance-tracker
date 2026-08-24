const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const config = require('../config/env');

// Configure cloudinary if credentials present
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
} else if (config.cloudinary.url) {
  cloudinary.config({
    cloudinary_url: config.cloudinary.url
  });
}

class UploadService {
  constructor() {
    this.uploadsDir = path.resolve(__dirname, '../../public/uploads');
    this.ensureUploadsDir();
  }

  ensureUploadsDir() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  isCloudinaryConfigured() {
    return !!(
      (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) ||
      config.cloudinary.url ||
      process.env.CLOUDINARY_URL
    );
  }

  /**
   * Uploads file buffer to Cloudinary if configured, else saves locally.
   * @param {Object} file - Express/Multer file object
   * @returns {Promise<string>} Uploaded file URL
   */
  async uploadFile(file) {
    if (!file || !file.buffer) {
      return null;
    }

    if (this.isCloudinaryConfigured()) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'society_maintenance',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              console.error('[UploadService] Cloudinary upload error, falling back to disk:', error.message);
              return this.saveToDisk(file).then(resolve).catch(reject);
            }
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    }

    return await this.saveToDisk(file);
  }

  async saveToDisk(file) {
    this.ensureUploadsDir();
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `photo-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const targetPath = path.join(this.uploadsDir, filename);

    await fs.promises.writeFile(targetPath, file.buffer);
    return `/uploads/${filename}`;
  }
}

module.exports = new UploadService();
