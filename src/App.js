import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {
  AppHeader,
  AppFooter,
  CreateAccount,
  AddIdentity,
  ManageIdentities,
  NoConnectionWarning,
} from './components';
import './App.css';
import theme from './theme';

function App() {
  const {
    activateBrowserWallet,
    account,
    chainId,
    active,
  } = useEthers();
  // const etherBalance = useEtherBalance(account);

  const identities = [{
    name: 'Main Identity',
    address: '0xfeb8f237873e846d9ddbf8a9477519ae3219984c',
    registered: false,
    locked: false,
  },
  {
    name: 'Private Identity',
    address: '0xB1cE9CE9cb1f2237ecbA5b3CaDF4860c86d24D63',
    registered: true,
    locked: true,
  }];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader
        account={account}
        chainId={chainId}
        active={active}
        handleClickConnect={() => activateBrowserWallet()}
      />
      <Container maxWidth="md" >
        <Box sx={{ minHeight: '100vh', paddingTop: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {!account && (
              <NoConnectionWarning
                handleClickConnect={() => activateBrowserWallet()}
              />
            )}
            {account && (
              <CreateAccount
                active={active}
              />
            )}
            {account && (
              <AddIdentity
                active={active}
              />
            )}
            {account && (
              <ManageIdentities
                active={active}
                identities={identities}
              />
            )}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </ThemeProvider>
  );
}

export default App;
