/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingState(props) {
  // no success message for approvals
  const { state } = props;

  if (state && state.status === 'Mining') {
    return (
      <Box
        sx={{
          width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 0,
        }}
      >
        <CircularProgress color="info" />
        <Typography>Transaction Pending...</Typography>
      </Box>
    );
  }

  if (state && state.status === 'PendingSignature') {
    return (
      <Box
        sx={{
          width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 0,
        }}
      >
        <CircularProgress color="info" />
        <Typography>Waiting for Wallet Signature...</Typography>
      </Box>
    );
  }

  if (state && state.status === 'Exception' && state.errorMessage) {
    return (
      <Box
        sx={{
          width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 0,
        }}
      >
        <CircularProgress color="error" variant="determinate" value={100} />
        <Typography>{state.errorMessage}</Typography>
      </Box>
    );
  }

  return <></>;
}

export default LoadingState;
