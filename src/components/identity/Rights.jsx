import React, { useState } from 'react';
import {
  Box, Button, Container, Paper, Stack, Typography,
} from '@mui/material';
import {
  getIdContract,
  getIdContractAddress,
  useGetSingleValue,
  getTokenContractAddress,
  getRightsContractAddress,
  getRightsContract,
} from '../../hooks/chainHooks';
import EthOnlyRights from './EthOnlyRights';
import CLKYC from './Rights/CLKYC';
import AuditVerify from './Rights/AuditVerify';
import SATA100 from './Rights/SATA100';

function Rights({
  chainId, id, account, theme,
}) {
  const idContract = getIdContract(chainId);
  const [isLoading, setLoading] = useState(false);
  const tokenContractAddress = getTokenContractAddress(chainId);
  const rightsContractAddress = getRightsContractAddress(chainId);
  const rightsContract = getRightsContract(chainId);

  const identityKey = useGetSingleValue(
    '_delegateKeyToIdentity',
    [id || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  // const has2XToken = useGetSingleValue(
  //   'holdsTokenOfSchema',
  //   [id || '', 1], // TODO: get the schemaId from mainnet deployment
  //   getRightsContractAddress(chainId),
  //   getRightsContract(chainId),
  // );

  // const has15XToken = useGetSingleValue(
  //   'holdsTokenOfSchema',
  //   [id || '', 3], // TODO: get the schemaId from mainnet deployment
  //   getRightsContractAddress(chainId),
  //   getRightsContract(chainId),
  // );

  const identityExists = useGetSingleValue(
    '_identityExists',
    [identityKey || ''],
    getIdContractAddress(chainId),
    idContract,
  );

  // const {
  //   state: modifier2XState,
  //   send: modifier2XSend,
  //   resetState: modifier2XResetState,
  // } = useClaimModifier2X();

  // const {
  //   state: modifier15XState,
  //   send: modifier15XSend,
  //   resetState: modifier15XResetState,
  // } = useClaimModifier15X();

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`https://id-api.signata.net/api/v1/requestKyc/${id}`);
  //       if (response && response.data && response.data.sigS) {
  //         console.log(response.data);

  //       } else {
  //         console.log(response);
  //         // setKycErrorMessage(
  //         //   'No completed KYC information found for this identity. Complete KYC with a Signata-integrated provider first.',
  //         // );
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (id) {
  //     getData();
  //   }
  // }, [id]);
  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ pt: 2 }}>
        <Typography variant="h6" component="h2">
          Decentralized Rights Exchange
        </Typography>
        {id && tokenContractAddress && account && (
          <CLKYC
            chainId={chainId}
            id={id}
            account={account}
            theme={theme}
            identityExists={identityExists}
            setLoading={setLoading}
            isLoading={isLoading}
            rightsContractAddress={rightsContractAddress}
            rightsContract={rightsContract}
            tokenContractAddress={tokenContractAddress}
          />
        )}
        {id && tokenContractAddress && account && (
          <AuditVerify
            chainId={chainId}
            id={id}
            account={account}
            theme={theme}
            identityExists={identityExists}
            setLoading={setLoading}
            isLoading={isLoading}
            rightsContractAddress={rightsContractAddress}
            rightsContract={rightsContract}
            tokenContractAddress={tokenContractAddress}
          />
        )}
        {id && tokenContractAddress && account && (
          <SATA100
            chainId={chainId}
            id={id}
            account={account}
            theme={theme}
            identityExists={identityExists}
            setLoading={setLoading}
            isLoading={isLoading}
            rightsContractAddress={rightsContractAddress}
            rightsContract={rightsContract}
            tokenContractAddress={tokenContractAddress}
          />
        )}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src="hoodie.jpg"
              alt="SATA 100 Merch"
              style={{
                maxWidth: 300,
                borderRadius: 8,
                border: 2,
                borderColor: 'primary.light',
              }}
            />
          </Box>
          <Button
            href="https://store.signata.net/"
            target="_blank"
            fullWidth
            variant="contained"
            color="secondary"
          >
            Get SATA 100 Merch
          </Button>
        </Paper>
      </Stack>
      {chainId === 1 && (
        <EthOnlyRights
          chainId={chainId}
          id={id}
          account={account}
          theme={theme}
          identityExists={identityExists}
        />
      )}
    </Container>
  );
}

export default Rights;
