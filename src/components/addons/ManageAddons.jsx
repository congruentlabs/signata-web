import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import Stack from '@mui/material/Stack';

function ManageAddons({
  cloudStorageActive,
  handleClickBuyCloudStorage,
  handleClickManageCloudStorage,
}) {
  return (
    <Stack alignItems="center" spacing={2} paddingBottom={2}>
      <Typography variant="h6" textAlign="center">
        Addons
      </Typography>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cloud Backup
            </Typography>
            <Typography variant="body1" gutterBottom>
              Keep your Signata identities backed up securely on Signata
              servers. We store your data Zero-Knowledge, meaning we cannot see
              any of your private information.
            </Typography>
            <Chip
              label={cloudStorageActive ? 'Active' : 'Inactive'}
              color={cloudStorageActive ? 'success' : 'error'}
              variant="outlined"
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

            <Button size="small" color="secondary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Stack>
  );
}

export default ManageAddons;
