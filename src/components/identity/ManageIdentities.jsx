import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useTheme } from '@mui/material/styles';
import { shortenIfAddress } from '@usedapp/core';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CreateIdentityPopup from './CreateIdentityPopup';
import EditIdentityPopup from './EditIdentityPopup';
import ImportIdentityPopup from './ImportIdentityPopup';
import ItemHeader from '../app/ItemHeader';
import ItemBox from '../app/ItemBox';

const headings = [
  { text: 'Name', align: 'left' },
  { text: 'Address', align: 'left' },
  { text: 'Type', align: 'center' },
  { text: 'Registered', align: 'center' },
  { text: 'Locked', align: 'center' },
];

function ManageIdentities() {
  const theme = useTheme();
  const [showCreateIdentityPopup, setShowCreateIdentityPopup] = useState(false);
  const [showImportIdentityPopup, setShowImportIdentityPopup] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(null);
  const [showEditIdentityPopup, setShowEditIdentityPopup] = useState(false);
  const [identities, setIdentities] = useLocalStorageState('identities', []);
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });
  // const identities = [{
  //   id: 1, name: 'Test', locked: false, type: 'Standard', registered: true, address: '0xce95DAde44E7307bAA616C77EF446915633dD9Ab',
  // }];

  return (
    <>
      {showCreateIdentityPopup && <CreateIdentityPopup />}
      {showImportIdentityPopup && <ImportIdentityPopup />}
      {showEditIdentityPopup && (
        <EditIdentityPopup editingIdentity={editingIdentity} />
      )}
      {identities
        && identities.map((id) => (
          <Grid item xs={12} md={6} key={id.id}>
            <ItemBox>
              <ItemHeader title={`Identity: ${id.name}`} />
              <CardContent>
                <Stack spacing={1}>
                  <Chip
                    label={id.address && shortenIfAddress(id.address)}
                    color="default"
                    sx={{
                      borderRadius: 0,
                      height: 48,
                      border: 1,
                      borderColor: 'black',
                    }}
                  />
                  <Chip
                    label={`Type: ${id.type}`}
                    color="default"
                    sx={{
                      borderRadius: 0,
                      height: 48,
                      border: 1,
                      borderColor: 'black',
                    }}
                  />
                  <Chip
                    label={id.locked ? 'Locked' : 'Unlocked'}
                    color={id.locked ? 'error' : 'success'}
                    icon={id.locked ? <LockIcon /> : <LockOpenIcon />}
                    sx={{
                      borderRadius: 0,
                      height: 48,
                      border: 1,
                      borderColor: 'black',
                    }}
                  />
                  <Chip
                    label={id.registered ? 'Registered' : 'Unregistered'}
                    color={id.registered ? 'success' : 'warning'}
                    icon={
                      id.registered ? <HowToRegIcon /> : <ErrorOutlineIcon />
                    }
                    sx={{
                      borderRadius: 0,
                      height: 48,
                      border: 1,
                      borderColor: 'black',
                    }}
                  />
                  <Typography />
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  onClick={() => {
                    setEditingIdentity(id);
                    setShowEditIdentityPopup(id);
                  }}
                  color="secondary"
                  variant="contained"
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
              </CardActions>
            </ItemBox>
          </Grid>
        ))}

      <Grid item xs={12} md={6}>
        <ItemBox>
          <ItemHeader text="Add Identity" />
          <CardContent>
            <Stack spacing={1}>

              <Alert severity="info">
                <AlertTitle>About Identities</AlertTitle>
                Full Signata Identities can be created or imported using the
                buttons below. You can create unlimited identities, each for a specific purpose.
              </Alert>
              {identities && identities.length < 1 && (
              <Chip
                label="No Identities Created"
                color="warning"
                sx={{
                  borderRadius: 0,
                  height: 48,
                  border: 1,
                  borderColor: 'black',
                }}
              />
              )}
              <ButtonGroup fullWidth orientation={isSm ? 'horizontal' : 'vertical'}>
                <Button
                  color="primary"
                  onClick={() => setShowCreateIdentityPopup(true)}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Create Identity
                </Button>
                <Button
                  color="secondary"
                  onClick={() => setShowImportIdentityPopup(true)}
                  variant="contained"
                  startIcon={<UploadIcon />}
                >
                  Import Identity
                </Button>
              </ButtonGroup>
            </Stack>
          </CardContent>
        </ItemBox>
      </Grid>
    </>
  );
}

export default ManageIdentities;
