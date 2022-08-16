import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { grey } from '@mui/material/colors';
import { shortenIfAddress, useLookupAddress } from '@usedapp/core';
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
  Box,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Grid,
  Typography,
} from '@mui/material';
import CreateIdentityPopup from './CreateIdentityPopup';
import EditIdentityPopup from './EditIdentityPopup';
import ImportIdentityPopup from './ImportIdentityPopup';

const headings = [
  { text: 'Name', align: 'left' },
  { text: 'Address', align: 'left' },
  { text: 'Type', align: 'center' },
  { text: 'Registered', align: 'center' },
  { text: 'Locked', align: 'center' },
];

function ManageIdentities() {
  const [showCreateIdentityPopup, setShowCreateIdentityPopup] = useState(false);
  const [showImportIdentityPopup, setShowImportIdentityPopup] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(null);
  const [showEditIdentityPopup, setShowEditIdentityPopup] = useState(false);
  const [identities, setIdentities] = useLocalStorageState('identities', []);
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
            <Box
              sx={{
                minHeight: {
                  md: 350,
                },
                borderRadius: 0,
                border: 1,
                borderColor: grey[600],
                backgroundColor: grey[50],
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      background: grey[300],
                      fontFamily: 'Roboto Condensed',
                      border: 1,
                      borderColor: 'black',
                    }}
                  >
                    Identity:
                    {' '}
                    {id.name}
                  </Typography>
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
            </Box>
          </Grid>
        ))}

      <Grid item xs={12} md={6}>
        <Box
          sx={{
            minHeight: {
              md: 350,
            },
            borderRadius: 0,
            border: 1,
            borderColor: grey[600],
            backgroundColor: grey[50],
          }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  background: grey[300],
                  fontFamily: 'Roboto Condensed',
                  border: 1,
                  borderColor: 'black',
                }}
              >
                Create Identity
              </Typography>

              <Alert severity="info" sx={{ borderRadius: 0, border: 1 }}>
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
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
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
          </CardActions>
        </Box>
      </Grid>
    </>
  );
}

export default ManageIdentities;
