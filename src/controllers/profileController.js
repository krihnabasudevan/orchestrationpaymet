const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (name, email)
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profilePicturePath = `/uploads/${req.file.filename}`;
    user.profilePicture = profilePicturePath;

    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile picture
exports.getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    const profilePicturePath = path.join(__dirname, '../../uploads', path.basename(user.profilePicture));
    const fileExists = fs.existsSync(profilePicturePath);

    if (!fileExists) {
      return res.status(404).json({
        message: 'File exists in DB but not found on disk',
        profilePicturePath,
      });
    }

    res.json({
      profilePictureUrl: `http://localhost:5000${user.profilePicture}`,
    });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
