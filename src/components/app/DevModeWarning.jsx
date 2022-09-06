import React from 'react';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

export function DevModeWarning() {
  return (
    <Grid item xs={12}>
      <Alert severity="info">
        Development Mode
      </Alert>
    </Grid>
  );
}

export default DevModeWarning;
