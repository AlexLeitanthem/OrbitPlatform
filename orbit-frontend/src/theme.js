// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5', // A strong blue for primary actions
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #f4f6f8;
          background-image:
            radial-gradient(at 20% 20%, hsla(210, 80%, 90%, 1) 0px, transparent 50%),
            radial-gradient(at 80% 80%, hsla(280, 80%, 90%, 1) 0px, transparent 50%);
        }
      `,
    },
  },
});


export default theme;