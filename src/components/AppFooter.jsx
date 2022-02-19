import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export const AppFooter = () => {
    return (
    <Container maxWidth="md" sx={{ paddingBottom: 5 }}>
      <Typography textAlign="center">
        &copy; {new Date().getFullYear()} Congruent Labs Pty Ltd
      </Typography>
    </Container>
  );
};