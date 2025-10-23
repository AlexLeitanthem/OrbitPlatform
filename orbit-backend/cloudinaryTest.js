// cloudinaryTest.js
require('dotenv').config(); // Load .env variables first
const cloudinary = require('cloudinary').v2;

// Configure using your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The test function
const runTest = async () => {
  console.log('Testing Cloudinary credentials...');
  try {
    // We upload a sample remote image to test the connection and credentials
    const result = await cloudinary.uploader.upload(
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
      { public_id: 'olympic_flag' }
    );
    console.log('✅ SUCCESS! Credentials are valid.');
    console.log('Image URL:', result.secure_url);
  } catch (error) {
    console.error('❌ FAILED! Credentials seem to be invalid.');
    console.error('Full Error Details:');
    console.dir(error); // Log the full error object
  }
};

runTest();