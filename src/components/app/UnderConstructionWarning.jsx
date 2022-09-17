import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';

function UnderConstructionWarning() {
  return (
    <Grid item xs={12}>
      <Alert severity="warning">
        <AlertTitle>App Under Construction</AlertTitle>
        This app is still under active development. Features may not work properly. Only use the app if you know
        what you are doing, or confirm with the development community which features work and which don&apos;t.
      </Alert>
    </Grid>
  );
}

export default UnderConstructionWarning;
