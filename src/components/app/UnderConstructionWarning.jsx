import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';

function UnderConstructionWarning() {
  return (
    <Grid item xs={8} sm={12}>
      <Alert severity="info">
        <AlertTitle>App Under Construction</AlertTitle>
        This app is still under active development. Some features may not work properly. We
        recommend using the Backup feature to keep your identities backed up until most bugs are
        squashed.
      </Alert>
    </Grid>
  );
}

export default UnderConstructionWarning;
