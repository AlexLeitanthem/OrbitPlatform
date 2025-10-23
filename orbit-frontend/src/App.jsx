// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useThemeContext } from './context/ThemeContext.jsx';

// Import Components and Pages
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AlumniDirectory from './pages/AlumniDirectory.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Posts from './pages/Posts.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import NotFound from './pages/NotFound.jsx';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// 👇 NEW: Import MyNetwork page
import MyNetwork from './pages/MyNetwork.jsx';

function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profiles" element={<AlumniDirectory />} />
          <Route path="profile/:id" element={<ProfilePage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<Posts />} />

            {/* 👇 NEW: My Network route */}
            <Route path="my-network" element={<MyNetwork />} />
          </Route>

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
