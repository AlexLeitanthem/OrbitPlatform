// src/context/ThemeContext.jsx

import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeContext = createContext({
  toggleColorMode: () => {},
});

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark'); // Defaulting to dark mode

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#0A3D62' },
                secondary: { main: '#E8C766' },
                background: { default: 'transparent', paper: 'rgba(255, 255, 255, 0.7)' },
                text: { primary: '#333333', secondary: '#555555' },
              }
            : {
                primary: { main: '#4A90E2' },
                secondary: { main: '#E8C766' },
                background: { default: 'transparent', paper: 'rgba(30, 30, 30, 0.7)' },
                text: { primary: '#E0E0E0', secondary: '#B0B0B0' },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: `
              body {
                background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background-cover.png);
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                margin: 0;
              }
            `,
          },
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }) => ({
                backdropFilter: 'blur(8px)',
                backgroundColor: theme.palette.background.paper,
              }),
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'none',
              }),
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ colorMode, mode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => React.useContext(ThemeContext);