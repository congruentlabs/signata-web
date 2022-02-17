import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';

export const CreateAccount = ({
  handleClickCreate,
  handleClickImport
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Alert severity="warning">
          <AlertTitle>No Signata Account</AlertTitle>
          This device hasn't yet been set up with a Signata account.
        </Alert>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <ButtonGroup>
          <Button
            color="primary"
            onClick={handleClickCreate}
          >
            Create Account
          </Button>
          <Button
            color="secondary"
            onClick={handleClickImport}
          >
            Import Account
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  )
};