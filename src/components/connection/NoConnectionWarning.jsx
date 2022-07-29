import React, { useState } from 'react';
import {
  CardContent,
  Card,
  Grid,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import ConnectionPopup from './ConnectionPopup';

export function NoConnectionWarning() {
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  return (
    <>
      {showConnectionPopup && (
        <ConnectionPopup handleClose={() => setShowConnectionPopup(false)} />
      )}
      <Grid item xs={12}>
        {/* <Card>
          <CardContent> */}
        <Alert
          sx={{ width: '100%' }}
          severity="info"
          action={(
            <Button
              color="primary"
              variant="contained"
              onClick={() => setShowConnectionPopup(true)}
            >
              Connect To Web3
            </Button>
          )}
        >
          <AlertTitle>Not connected to Web3</AlertTitle>
          To use Signata you must connect to a web3 network first.
        </Alert>
        {/* </CardContent>
        </Card> */}
      </Grid>
    </>
  );
}

export default NoConnectionWarning;
