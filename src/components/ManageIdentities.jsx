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
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { shortenIfAddress } from '@usedapp/core';

export const ManageIdentities = ({
  handleClickCreate,
  handleClickImport,
  handleClickManage,
  identities,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Your Signata Identities
        </Typography>
        {/* <Typography variant="body1">
          A Signata Identity looks a lot like a crypto wallet, and can be used like one, but it has some extra features. Create and manage your identities below.
        </Typography> */}
      </Grid>
      {identities && identities.map((id) => (
        <Grid item xs={12} sm={6} md={4} key={id.address}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {id.name}
              </Typography>
              <Typography variant="overline">
                {id.address && shortenIfAddress(id.address)}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={id.locked ? "Locked" : "Unlocked"}
                  color={id.locked ? "error" : "success"}
                  variant={id.locked ? "filled" : "outlined"}
                  icon={id.locked ? <LockIcon /> : <LockOpenIcon />}
                />
                <Chip
                  label={id.registered ? "Registered" : "Unregistered"}
                  color={id.registered ? "success" : "warning"}
                  variant={id.registered ? "outlined" : "filled"}
                  icon={id.registered ? <HowToRegIcon /> : <ErrorOutlineIcon />}
                />
              </Stack>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => handleClickManage(id)}
                size="small"
                color="secondary"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <ButtonGroup orientation="vertical" fullWidth variant="contained">
              <Button
                color="primary"
                onClick={handleClickCreate}
                startIcon={<AddIcon />}
              >
                Create Identity
              </Button>
              <Button
                color="secondary"
                onClick={handleClickImport}
                startIcon={<ImportExportIcon />}
              >
                Import Identity
              </Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
};