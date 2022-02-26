import React from 'react';
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";

export function AppFooter() {
  return (
    <Container maxWidth="md" sx={{ paddingBottom: 5 }}>
      <Typography textAlign="center">
        &copy; {new Date().getFullYear()} Congruent Labs Pty Ltd
      </Typography>
      <Typography textAlign="center">
        This application is currently under active development and may not work as expected.
      </Typography>
    </Container>
  );
}

export default AppFooter;
