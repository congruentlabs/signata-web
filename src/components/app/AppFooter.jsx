import React from 'react';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export function AppFooter() {
  return (
    <Container maxWidth="md" sx={{ paddingBottom: 5, paddingTop: 10 }}>
      <Typography textAlign="center" variant="body2">
        &copy;
        {' '}
        {new Date().getFullYear()}
        {' '}
        Congruent Labs Pty Ltd
      </Typography>
      <Typography textAlign="center" variant="body2">
        This application is currently under active development. Token prices
        shown are derived from Uniswap.
      </Typography>
    </Container>
  );
}

export default AppFooter;
