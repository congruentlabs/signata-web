import React, { shortenIfAddress } from "@usedapp/core";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Grid from "@mui/material/Grid";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UploadIcon from "@mui/icons-material/Upload";

function ManageIdentities({
  handleClickCreate,
  handleClickImport,
  handleClickManage,
  identities,
}) {
  return (
    <>
      <Grid item xs={12}>
        <Divider variant="middle">Your Identities</Divider>
      </Grid>
      {identities && identities.length < 1 && (
        <Grid item xs={12} md={8} sm={6}>
          <Alert severity="info">
            <AlertTitle>No Identity Registered Yet</AlertTitle>
            To get started, create a new identity or import an existing
            identity. You can create as many identities as you need, and each
            identity is independent of each other.
          </Alert>
        </Grid>
      )}
      {identities &&
        identities.map((id) => (
          <Grid item xs={12} md={4} sm={6} key={id.address}>
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
                    icon={
                      id.registered ? <HowToRegIcon /> : <ErrorOutlineIcon />
                    }
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
        {/* <Card>
          <CardContent> */}
        <ButtonGroup
          orientation="vertical"
          size="large"
          fullWidth
          variant="text"
        >
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
            startIcon={<UploadIcon />}
          >
            Import Identity
          </Button>
        </ButtonGroup>
        {/* </CardContent>
        </Card> */}
      </Grid>
    </>
  );
}

export default ManageIdentities;
