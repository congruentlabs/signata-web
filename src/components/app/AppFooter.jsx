import React from 'react';
import {
  Container, Typography, Box, IconButton,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function AppFooter({ colorMode, theme }) {
  return (
    <Container maxWidth="md" sx={{ paddingBottom: 5, paddingTop: 5 }}>
      <Box textAlign="center" sx={{ mt: 5, mb: 2 }}>
        <IconButton sx={{ mx: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Typography textAlign="center" variant="body2">
        &copy;
        {' '}
        {new Date().getFullYear()}
        {' '}
        Congruent Labs Pty Ltd
      </Typography>
      <Typography textAlign="center" variant="body2">
        This application is currently under active development.
      </Typography>
    </Container>
  );
}

export default AppFooter;
