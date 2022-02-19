import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';

export const CreateAccount = ({
  handleClickCreate,
  handleClickImport
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Alert severity="info">
          <AlertTitle>No Signata Account on this Device</AlertTitle>
          This device has not been set up with a Signata account. Create a new account, or import your existing account.
        </Alert>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <ButtonGroup size="large">
          <Button
            color="primary"
            onClick={handleClickCreate}
            startIcon={<AddIcon />}
          >
            Create Account
          </Button>
          <Button
            color="secondary"
            onClick={handleClickImport}
            startIcon={<UploadIcon />}
          >
            Import Account
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  )
};