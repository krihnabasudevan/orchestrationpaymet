const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  updateProfilePicture,
  getProfilePicture,
} = require('../controllers/profileController');

const router = express.Router();

// Set up Multer to store uploaded files in the root-level `uploads` folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Save in the root-level `uploads` directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File must be an image'), false);
    }
  },
});

// Define routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/picture', authenticateToken, upload.single('profilePicture'), updateProfilePicture);
router.get('/picture', authenticateToken, getProfilePicture);

module.exports = router;
