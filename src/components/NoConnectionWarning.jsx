import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';

export const NoConnectionWarning = ({
  handleClickConnect
}) => {
  return (
    <Alert
      severity="info"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={handleClickConnect}
        >
          Connect
        </Button>
      }
    >
      <AlertTitle>Not Connected to Web3</AlertTitle>
      To use Signata you must connect to a valid web3 network first.
    </Alert>
  )
};