import React from 'react';
import {
  Dialog, DialogTitle, Paper, DialogContent, Stack, Alert, ButtonGroup, Button, AlertTitle,
} from '@mui/material';

function ChangeDialog(props) {
  // no success message for approvals
  const {
    open, onClose, onSubmit, title, alertSeverity, alertText, submitColor, submitText, fields, disableSubmit, errorMessage,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity={alertSeverity}>
              {alertText}
            </Alert>
            {fields}
            {errorMessage && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            )}
            <Paper>
              <ButtonGroup fullWidth variant="text">
                <Button
                  onClick={onClose}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button
                    // fullWidth
                  type="submit"
                  variant="contained"
                  color={submitColor}
                  disabled={disableSubmit}
                >
                  {submitText}
                </Button>
              </ButtonGroup>
            </Paper>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ChangeDialog;
