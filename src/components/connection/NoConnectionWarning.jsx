import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export function NoConnectionWarning({ handleClickConnect }) {
  return (
    <Grid item xs={12}>
      <Alert
        severity="info"
        action={(
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={handleClickConnect}
          >
            Connect To Web3
          </Button>
        )}
      >
        <AlertTitle>Not connected to web3</AlertTitle>
        To use Signata you must connect to a web3 network first.
      </Alert>
    </Grid>
  );
}

export default NoConnectionWarning;
