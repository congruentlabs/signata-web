import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';

export const ManageAddons = ({
  cloudStorageActive,
  handleClickBuyCloudStorage,
  handleClickManageCloudStorage,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Divider variant="middle">
          Addons
        </Divider>
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