import React, { useState } from 'react';
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
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import useLocalStorageState from 'use-local-storage-state';
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

  return (
    <>
      {showCreateIdentityPopup && <CreateIdentityPopup />}
      {showImportIdentityPopup && <ImportIdentityPopup />}
      {showEditIdentityPopup && (
        <EditIdentityPopup editingIdentity={editingIdentity} />
      )}
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6" align="left">
              Your Identities
            </Typography>
            {identities && identities.length < 1 && (
              <Alert severity="info">
                <AlertTitle>No Identity Registered Yet</AlertTitle>
                To get started, create a new identity or import an existing
                identity. You can create as many identities as you need, and
                each identity is independent of each other.
              </Alert>
            )}
            <TableContainer>
              <Table size="small" aria-label="identities table">
                <TableHead>
                  <TableRow>
                    {headings.map((heading) => (
                      <TableCell key={heading.text} align={heading.align}>
                        {heading.text}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {identities
                    && identities.map((id) => (
                      <TableRow
                        key={id.name}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="left">{id.name}</TableCell>
                        <TableCell align="left">
                          {id.address && shortenIfAddress(id.address)}
                        </TableCell>
                        <TableCell align="center">{id.type}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={id.locked ? 'Locked' : 'Unlocked'}
                            color={id.locked ? 'error' : 'success'}
                            variant={id.locked ? 'filled' : 'outlined'}
                            icon={id.locked ? <LockIcon /> : <LockOpenIcon />}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              id.registered ? 'Registered' : 'Unregistered'
                            }
                            color={id.registered ? 'success' : 'warning'}
                            variant={id.registered ? 'outlined' : 'filled'}
                            icon={
                              id.registered ? (
                                <HowToRegIcon />
                              ) : (
                                <ErrorOutlineIcon />
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() => {
                              setEditingIdentity(id);
                              setShowEditIdentityPopup(id);
                            }}
                            size="small"
                            color="secondary"
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!identities && (
                    <TableRow>
                      <TableCell colSpan={headings.length}>
                        No identities found. Create or import an identity to get
                        started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
        <CardActions>
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
      </Card>
    </>
  );
}

export default ManageIdentities;
