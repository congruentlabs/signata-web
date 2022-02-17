import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';

export const ManageIdentities = ({
  handleClickCreate,
  handleClickImport,
  identities,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Manage Identities
        </Typography>
        <Typography variant="body1">
          Manage Identities
        </Typography>
      </Grid>
      {identities && identities.map((identity) => (
        <Grid item xs={12} sm={6} md={4}>
          Identity
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4}>
        <ButtonGroup orientation="vertical" fullWidth>
          <Button
            color="primary"
            onClick={handleClickCreate}
          >
            Create Identity
          </Button>
          <Button
            color="secondary"
            onClick={handleClickImport}
          >
            Import Identity
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  )
};