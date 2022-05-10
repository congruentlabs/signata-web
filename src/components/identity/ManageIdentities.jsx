import React, { shortenIfAddress } from '@usedapp/core';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Grid from '@mui/material/Grid';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UploadIcon from '@mui/icons-material/Upload';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const headings = [
  { text: 'Name', align: 'left' },
  { text: 'Address', align: 'left' },
  { text: 'Type', align: 'center' },
  { text: 'Registered', align: 'center' },
  { text: 'Locked', align: 'center' }
];

function ManageIdentities({ handleClickCreate, handleClickImport, handleClickManage, identities }) {
  return (
    <Stack alignItems="center" spacing={2} paddingBottom={2}>
      <Typography variant="h6" textAlign="center">
        Your Identities
      </Typography>
      {identities && identities.length < 1 && (
        <Alert severity="info">
          <AlertTitle>No Identity Registered Yet</AlertTitle>
          To get started, create a new identity or import an existing identity. You can create as many identities as you
          need, and each identity is independent of each other.
        </Alert>
      )}
      <TableContainer component={Paper}>
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
            {identities &&
              identities.map((id) => (
                <TableRow key={id.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{id.name}</TableCell>
                  <TableCell align="left">{id.address && shortenIfAddress(id.address)}</TableCell>
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
                      label={id.registered ? 'Registered' : 'Unregistered'}
                      color={id.registered ? 'success' : 'warning'}
                      variant={id.registered ? 'outlined' : 'filled'}
                      icon={id.registered ? <HowToRegIcon /> : <ErrorOutlineIcon />}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleClickManage(id)}
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
                  No identities found. Create or import an identity to get started.
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={headings.length}>
                <ButtonGroup orientation="horizontal" fullWidth variant="text" size="small">
                  <Button color="primary" onClick={handleClickCreate} startIcon={<AddIcon />}>
                    Create Identity
                  </Button>
                  <Button color="secondary" onClick={handleClickImport} startIcon={<UploadIcon />}>
                    Import Identity
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default ManageIdentities;
