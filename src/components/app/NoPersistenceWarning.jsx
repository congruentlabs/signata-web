import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';

export function NoPersistenceWarning() {
  return (
    <Grid item xs={12}>
      <Alert severity="warning">
        <AlertTitle>Can&apos;t save data!</AlertTitle>
        Your web browser is not allowing data to be saved. If you close this
        page or tab you may lose your data.
      </Alert>
    </Grid>
  );
}

export default NoPersistenceWarning;
