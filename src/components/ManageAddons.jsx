import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import LockIcon from '@mui/icons-material/Lock';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CardContent from '@mui/material/CardContent';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Stack from '@mui/material/Stack';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { shortenIfAddress } from '@usedapp/core';

export const ManageAddons = ({
  cloudStorageActive,
  handleClickBuyCloudStorage,
  handleClickManageCloudStorage,
}) => {
  return (
    <>
      <Grid item xs={12} textAlign="center">
        <Typography variant="h6" gutterBottom>
          Signata Addons
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cloud Backup
            </Typography>
            <Typography variant="body1" gutterBottom>
              Keep your Signata identities backed up securely on Signata servers. We store your data Zero-Knowledge, meaning we cannot see any
              of your private information.
            </Typography>
            <Chip
              label={cloudStorageActive ? "Active" : "Inactive"}
              color={cloudStorageActive ? "success" : "error"}
              variant='outlined'
              icon={cloudStorageActive ? <CloudDoneIcon /> : <CloudOffIcon />}
            />
          </CardContent>
          <CardActions>
            {cloudStorageActive ? (
              <Button
                size="small"
                color="secondary"
                onClick={handleClickManageCloudStorage}
              >
                Manage
              </Button>
            ) : (
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleClickBuyCloudStorage}
              >
                Buy
              </Button>
            )}
            
            <Button
              size="small"
              color="secondary"
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  )
};