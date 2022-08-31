/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  Box, CircularProgress, Typography, Grid,
} from '@mui/material';

function LoadingStateGrid(props) {
  // no success message for approvals
  const { state } = props;

  if (state && state.status === 'Mining') {
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            padding: 2,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 0,
          }}
        >
          <CircularProgress />
          <Typography>Transaction Pending...</Typography>
        </Box>
      </Grid>
    );
  }

  if (state && state.status === 'PendingSignature') {
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            padding: 2,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 0,
          }}
        >
          <CircularProgress color="secondary" />
          <Typography>Waiting for Wallet Signature...</Typography>
        </Box>
      </Grid>
    );
  }

  if (state && state.status === 'Exception' && state.errorMessage) {
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            padding: 2,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 0,
          }}
        >
          <CircularProgress color="error" variant="determinate" value={100} />
          <Typography>{state.errorMessage}</Typography>
        </Box>
      </Grid>
    );
  }

  return <></>;
}

export default LoadingStateGrid;
