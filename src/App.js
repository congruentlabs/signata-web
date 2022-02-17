import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
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

function App() {
  const {
    activateBrowserWallet,
    account,
    chainId,
    active,
  } = useEthers();
  // const etherBalance = useEtherBalance(account);

  return (
    <div>
      <AppHeader
        account={account}
        chainId={chainId}
        active={active}
        handleClickConnect={() => activateBrowserWallet()}
      />
      <Container maxWidth="lg" >
        <Box sx={{ minHeight: '100vh', paddingTop: 2 }}>
          <Grid container spacing={2}>
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
              />
            )}
          </Grid>
        </Box>
      </Container>
      <AppFooter />
    </div>
  );
}

export default App;
