import { createTheme } from '@mui/material/styles';
import { green, deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[900],
    },
    secondary: {
      main: deepPurple[800],
    },
    // mode: 'dark',
    typography: {
      fontFamily: 'Montserrat',
    },
  },
});

export default theme;