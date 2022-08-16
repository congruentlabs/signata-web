import React, { useState } from 'react';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Box,
  CardContent,
  CardActions,
  ButtonGroup,
  Button,
  Stack,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  TextField,
  useMediaQuery,
} from '@mui/material';

function YourAccount() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  return (
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          minHeight: {
            md: 350,
          },
          borderRadius: 0,
          border: 1,
          borderColor: grey[600],
          backgroundColor: grey[50],
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            background: grey[300],
            fontFamily: 'Roboto Condensed',
            borderBottom: 1,
            borderColor: grey[600],
          }}
        >
          Your Account
        </Typography>
        <CardContent>
          <Stack spacing={1}>
            <TextField label="Password" variant="filled" color="secondary" size="small" />
            <ButtonGroup
              fullWidth
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              <Button
                color="primary"
                variant="contained"
                // disabled={isLoading}
                // startIcon={<AddIcon />}
                // onClick={handleClickCreate}
              >
                Unlock
              </Button>
            </ButtonGroup>
            <Alert severity="info">
              Your password encrypts all of your identities. Your identities are
              only stored on this device. You can download a copy of your account to
              back it up, or use the Cloud Addon to securely back up on Signata
              servers.
            </Alert>
            <ButtonGroup
              fullWidth
              size="small"
              orientation={isSm ? 'horizontal' : 'vertical'}
            >
              <Button
                color="secondary"
                variant="outlined"
                // disabled={isLoading}
                // startIcon={<AddIcon />}
                // onClick={handleClickCreate}
              >
                Download
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                // disabled={isLoading}
                // startIcon={<AddIcon />}
                // onClick={handleClickCreate}
              >
                Restore
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
      </Box>
    </Grid>
  );
}

export default YourAccount;
