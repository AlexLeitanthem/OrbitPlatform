const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary config is already set in server.js
// or you can optionally configure here as fallback
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Create a multer uploader for a specific folder
 * @param {string} folder - Cloudinary folder name
 * @returns multer upload instance
 */
const createUploader = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
  });

  return multer({ storage });
};

module.exports = createUploader;
