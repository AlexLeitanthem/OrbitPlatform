// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ExperienceForm from "../components/ExperienceForm.jsx";
import EducationForm from "../components/EducationForm.jsx";
import ProfileEditForm from "../components/ProfileEditForm.jsx";
import ProfilePictureUpload from "../components/ProfilePictureUpload.jsx";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Modal,
  Container,
  Chip,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";

const drawerWidth = 240;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center",
};

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sidebar selection
  const [selectedTab, setSelectedTab] = useState("profile");

  // Modal states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [eduModalOpen, setEduModalOpen] = useState(false);

  const [newSkill, setNewSkill] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [editingExp, setEditingExp] = useState(null);
  const [editingEdu, setEditingEdu] = useState(null);

  const getProfile = async () => {
    setLoading(true);
    try {
      const token = user?.token;
      if (!token) return setLoading(false);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        "http://localhost:5001/api/profiles/me",
        config
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Could not fetch profile", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getProfile();
    else setLoading(false);
  }, [user]);

  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (type === "experience") {
        await axios.delete(
          `http://localhost:5001/api/profiles/experience/${id}`,
          config
        );
        toast.success("Experience removed");
      } else {
        await axios.delete(
          `http://localhost:5001/api/profiles/education/${id}`,
          config
        );
        toast.success("Education removed");
      }
      getProfile();
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      setConfirmDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const newSkills = [...profile.skills, newSkill];
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5001/api/profiles",
        { skills: newSkills },
        config
      );
      toast.success("Skill added!");
      setNewSkill("");
      getProfile();
    } catch {
      toast.error("Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    const newSkills = profile.skills.filter((skill) => skill !== skillToDelete);
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5001/api/profiles",
        { skills: newSkills },
        config
      );
      toast.success("Skill removed!");
      getProfile();
    } catch {
      toast.error("Failed to remove skill.");
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;

  if (!profile) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.user.name}
        </Typography>
        <Typography>
          You haven't created a profile yet. Please fill out your details.
        </Typography>
        <ProfileEditForm onUpdate={getProfile} existingProfile={null} />
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem
            button
            selected={selectedTab === "profile"}
            onClick={() => setSelectedTab("profile")}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === "experience"}
            onClick={() => setSelectedTab("experience")}
          >
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Experience" />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === "education"}
            onClick={() => setSelectedTab("education")}
          >
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Education" />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === "skills"}
            onClick={() => setSelectedTab("skills")}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Skills" />
          </ListItem>
          <ListItem
            button
            selected={selectedTab === "settings"}
            onClick={() => setSelectedTab("settings")}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedTab === "profile" && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ProfilePictureUpload />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h4">{profile.user.name}</Typography>
                  <Typography variant="body1">{profile.status}</Typography>
                  {profile.bio && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 0.5 }}
                    >
                      {profile.bio}
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton onClick={() => setProfileModalOpen(true)}>
                <EditIcon />
              </IconButton>
            </Box>
          </Paper>
        )}

        {selectedTab === "experience" && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">Experience</Typography>
              <IconButton
                onClick={() => {
                  setEditingExp(null);
                  setExpModalOpen(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {profile.experience.map((exp) => (
              <Box
                key={exp._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  pb: 1,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Box>
                  <Typography variant="h6">
                    {exp.title} at {exp.company}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(exp.from).toLocaleDateString()} -{" "}
                    {exp.to ? new Date(exp.to).toLocaleDateString() : "Present"}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => {
                      setEditingExp(exp);
                      setExpModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => confirmDelete("experience", exp._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {selectedTab === "education" && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">Education</Typography>
              <IconButton
                onClick={() => {
                  setEditingEdu(null);
                  setEduModalOpen(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {profile.education.map((edu) => (
              <Box
                key={edu._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  pb: 1,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Box>
                  <Typography variant="h6">
                    {edu.school} - {edu.degree}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {edu.fieldofstudy}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => {
                      setEditingEdu(edu);
                      setEduModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => confirmDelete("education", edu._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {selectedTab === "skills" && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {profile.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                />
              ))}
            </Box>
            <Box
              component="form"
              onSubmit={handleAddSkill}
              sx={{ display: "flex", gap: 1 }}
            >
              <TextField
                size="small"
                label="Add a new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                variant="outlined"
                sx={{ flexGrow: 1 }}
              />
              <Button type="submit" variant="contained">
                Add
              </Button>
            </Box>
          </Paper>
        )}

        {selectedTab === "settings" && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">Settings</Typography>
            <Typography variant="body2">
              Account management, privacy, notifications, etc.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Right Sidebar */}
      <Box sx={{ width: 280, p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body2">
            Keep your profile updated.
          </Typography>
        </Paper>
      </Box>

      {/* Modals */}
      <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
        <Box sx={modalStyle}>
          <ProfileEditForm
            onUpdate={() => {
              getProfile();
              setProfileModalOpen(false);
            }}
            existingProfile={profile}
          />
        </Box>
      </Modal>

      <Modal open={expModalOpen} onClose={() => setExpModalOpen(false)}>
        <Box sx={modalStyle}>
          <ExperienceForm
            data={editingExp}
            onUpdate={() => {
              getProfile();
              setExpModalOpen(false);
            }}
          />
        </Box>
      </Modal>

      <Modal open={eduModalOpen} onClose={() => setEduModalOpen(false)}>
        <Box sx={modalStyle}>
          <EducationForm
            data={editingEdu}
            onUpdate={() => {
              getProfile();
              setEduModalOpen(false);
            }}
          />
        </Box>
      </Modal>

      <Modal
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Are you sure?
          </Typography>
          <Typography variant="body2" gutterBottom>
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;
