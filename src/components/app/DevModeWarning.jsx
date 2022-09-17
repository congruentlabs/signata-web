import React from 'react';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

function DevModeWarning() {
  return (
    <Grid item xs={8}>
      <Alert severity="info" variant="filled">
        Development Mode
      </Alert>
    </Grid>
  );
}

export default DevModeWarning;
