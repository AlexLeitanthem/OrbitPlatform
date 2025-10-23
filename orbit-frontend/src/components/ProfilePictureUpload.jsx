// src/components/ProfilePictureUpload.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Modal, Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: 'center',
};

const imagePreviewModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  maxWidth: '90vw',
  maxHeight: '90vh',
};

function ProfilePictureUpload() {
  const { user, updateUser, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setUploadModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select an image first.");
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const token = user?.token;
      if (!token) return toast.error("Authentication token not found.");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "http://localhost:5001/api/users/avatar",
        formData,
        config
      );

      // 👇 Add timestamp to prevent caching
      const newAvatarUrl = `${response.data.avatar}?t=${new Date().getTime()}`;

      // 👇 Optimistically update context so all components refresh immediately
      const updatedUser = {
        ...user,
        user: {
          ...user.user,
          avatar: newAvatarUrl,
        },
      };
      updateUser(updatedUser);

      toast.success("Profile picture updated successfully!");
      setUploadModalOpen(false);
      setSelectedFile(null);
      setPreviewImage(null);

      // 👇 Optional: refresh user to fully sync with backend
      await refreshUser();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(error.response?.data?.message || "Failed to upload picture.");
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <IconButton onClick={() => setImagePreviewModalOpen(true)} sx={{ p: 0 }}>
        <Avatar
          src={user?.user?.avatar}
          sx={{ width: 80, height: 80, cursor: 'pointer' }}
        />
      </IconButton>
      <IconButton
        onClick={() => fileInputRef.current.click()}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          bgcolor: 'background.paper',
          p: 0.5,
        }}
        size="small"
      >
        <EditIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Confirm Upload
          </Typography>
          {previewImage && (
            <Avatar
              src={previewImage}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
          )}
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setUploadModalOpen(false);
              setSelectedFile(null);
              setPreviewImage(null);
            }}
            sx={{ ml: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal
        open={imagePreviewModalOpen}
        onClose={() => setImagePreviewModalOpen(false)}
      >
        <Box sx={imagePreviewModalStyle}>
          <img
            src={user?.user?.avatar}
            alt="Profile Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default ProfilePictureUpload;
