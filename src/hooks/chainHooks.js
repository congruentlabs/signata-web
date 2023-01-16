/* eslint-disable prefer-template */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useContractFunction, useCall, useBlockNumber } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import * as consts from '../config';
import TOKEN_ABI from './sataAbi.json';
import ID_ABI from './identityAbi.json';
import RIGHTS_ABI from './rightsAbi.json';
import KYC_CLAIM_ABI from './kycClaimAbi.json';
import SATA_100_ABI from './sata100Abi.json';
import AUDIT_CLAIM_ABI from './auditClaimAbi.json';

const sataPriceQuery = gql`
  {
    token(id: "0x3ebb4a4e91ad83be51f8d596533818b246f4bee1") {
      totalSupply
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      derivedETH
    }
  }
`;

const dSataPriceQuery = gql`
  {
    token(id: "0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b") {
      totalSupply
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      derivedETH
    }
  }
`;

export const getRightsContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.RIGHTS_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return consts.RIGHTS_CONTRACT_RINKEBY;
  }
  if (chainId === 5) {
    return consts.RIGHTS_CONTRACT_GOERLI;
  }
  if (chainId === 56) {
    // bsc
    return consts.RIGHTS_CONTRACT_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.RIGHTS_CONTRACT_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.RIGHTS_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.RIGHTS_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.RIGHTS_CONTRACT_AVAX;
  }
  if (chainId === 42161) {
    // avax
    return consts.RIGHTS_CONTRACT_ARBITRUM;
  }
  return consts.RIGHTS_CONTRACT_MAINNET;
};

export const getRightsContract = (chainId) => new Contract(getRightsContractAddress(chainId), RIGHTS_ABI);

export const getTokenContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.TOKEN_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return consts.TOKEN_CONTRACT_RINKEBY;
  }
  if (chainId === 5) {
    return consts.TOKEN_CONTRACT_GOERLI;
  }
  if (chainId === 56) {
    // bsc
    return consts.TOKEN_CONTRACT_BSC;
  }
  if (chainId === 250) {
    // fantom
    return consts.TOKEN_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.TOKEN_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.TOKEN_CONTRACT_AVAX;
  }
  if (chainId === 42161) {
    // avax
    return consts.TOKEN_CONTRACT_ARBITRUM;
  }
  return consts.TOKEN_CONTRACT_MAINNET;
};

export const getTokenContract = (chainId) => new Contract(getTokenContractAddress(chainId), TOKEN_ABI);

export const getIdContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.ID_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return consts.ID_CONTRACT_RINKEBY;
  }
  if (chainId === 5) {
    return consts.ID_CONTRACT_GOERLI;
  }
  if (chainId === 56) {
    // bsc
    return consts.ID_CONTRACT_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.ID_CONTRACT_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.ID_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.ID_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.ID_CONTRACT_AVAX;
  }
  if (chainId === 42161) {
    // avax
    return consts.ID_CONTRACT_ARBITRUM;
  }
  return consts.ID_CONTRACT_MAINNET;
};

export const getIdContract = (chainId) => new Contract(getIdContractAddress(chainId), ID_ABI);

export const getKycClaimContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.KYC_RIGHTS_CLAIM_MAINNET;
  }
  if (chainId === 4) {
    return consts.KYC_RIGHTS_CLAIM_RINKEBY;
  }
  if (chainId === 5) {
    return consts.KYC_RIGHTS_CLAIM_GOERLI;
  }
  if (chainId === 56) {
    // bsc
    return consts.KYC_RIGHTS_CLAIM_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.KYC_RIGHTS_CLAIM_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.KYC_RIGHTS_CLAIM_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.KYC_RIGHTS_CLAIM_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.KYC_RIGHTS_CLAIM_AVAX;
  }
  if (chainId === 42161) {
    // avax
    return consts.KYC_RIGHTS_CLAIM_ARBITRUM;
  }
  return consts.KYC_RIGHTS_CLAIM_MAINNET;
};

export const getKycClaimContract = (chainId) => new Contract(getKycClaimContractAddress(chainId), KYC_CLAIM_ABI);

export const getSata100ContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.SATA_100_MAINNET;
  }
  if (chainId === 4) {
    return consts.SATA_100_RINKEBY;
  }
  if (chainId === 5) {
    return consts.SATA_100_GOERLI;
  }
  if (chainId === 56) {
    // bsc
    return consts.SATA_100_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.SATA_100_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.SATA_100_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.SATA_100_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.SATA_100_AVAX;
  }
  if (chainId === 42161) {
    // avax
    return consts.SATA_100_ARBITRUM;
  }
  return consts.SATA_100_MAINNET;
};

export const getAuditClaimContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.AUDIT_CLAIM_MAINNET;
  }
  if (chainId === 4) {
    return consts.AUDIT_CLAIM_RINKEBY;
  }
  if (chainId === 5) {
    return consts.AUDIT_CLAIM_GOERLI;
  }
  if (chainId === 56) {
    // bsc
    return consts.AUDIT_CLAIM_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.AUDIT_CLAIM_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.AUDIT_CLAIM_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.AUDIT_CLAIM_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.AUDIT_CLAIM_AVAX;
  }
  if (chainId === 42161) {
    // avax
    return consts.AUDIT_CLAIM_ARBITRUM;
  }
  return consts.AUDIT_CLAIM_MAINNET;
};

export const getAuditClaimContract = (chainId) => new Contract(getAuditClaimContractAddress(chainId), AUDIT_CLAIM_ABI);

export const getSata100Contract = (chainId) => new Contract(getSata100ContractAddress(chainId), SATA_100_ABI);

export const getModifier2XContractAddress = () => consts.MODIFIER_2X_MAINNET; // mainnet only

export const getModifier2XContract = () => new Contract(getSata100ContractAddress(), SATA_100_ABI);

export const getModifier15XContractAddress = () => consts.MODIFIER_15X_MAINNET; // mainnet only

export const getModifier15XContract = () => new Contract(getSata100ContractAddress(), SATA_100_ABI);

export const useGetValue = (method, args, contractAddress, contract) => {
  const { value, error } = useCall(
    contractAddress && {
      contract,
      method,
      args,
    },
  ) ?? {};
  if (error) {
    console.error(error.message);
    return {};
  }
  return value;
};

export const useGetSingleValue = (method, args, contractAddress, contract) => {
  const { value, error } = useCall(
    contractAddress && {
      contract,
      method,
      args,
    },
  ) ?? {};
  if (error) {
    console.error(error.message);
    return {};
  }
  return value?.[0];
};

export function useUniswapSataPriceData() {
  // const { account } = useEthers();
  const { data } = useQuery(sataPriceQuery, {});
  return data;
}

export function useUniswapDSataPriceData() {
  // const { account } = useEthers();
  const { data } = useQuery(dSataPriceQuery, {});
  return data;
}

export function useCreateIdentity(chainId) {
  const d = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(d, 'create', {
    transactionName: 'Create Signata Identity',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useDestroyIdentity(chainId) {
  const c = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(c, 'destroy', {
    transactionName: 'Destroy Signata Identity',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useLockIdentity(chainId) {
  const c = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(c, 'lock', {
    transactionName: 'Lock Signata Identity',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useUnlockIdentity(chainId) {
  const c = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(c, 'unlock', {
    transactionName: 'Unlock Signata Identity',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useRolloverIdentity(chainId) {
  const c = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(c, 'rollover', {
    transactionName: 'Rollover Signata Identity',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useClaimKycNft(chainId) {
  const kycClaimContract = getKycClaimContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(kycClaimContract, 'claimRight', {
    transactionName: 'Claim KYC Right',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useClaimAuditNft(chainId) {
  const c = getAuditClaimContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    c,
    'claimRight',
    {
      transactionName: 'Claim Proof of Audit Right',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function usePurchaseSata100Nft(chainId) {
  const c = getSata100Contract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    c,
    'purchaseRight',
    {
      transactionName: 'Puchase SATA 100 Right',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useClaimModifier15X() {
  const c = getModifier15XContract();
  const {
    state, send, events, resetState,
  } = useContractFunction(
    c,
    'claimRight',
    {
      transactionName: 'Claim 2X Modifier Right',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useClaimModifier2X() {
  const modifier2XContract = getModifier2XContract();
  const {
    state, send, events, resetState,
  } = useContractFunction(
    modifier2XContract,
    'claimRight',
    {
      transactionName: 'Claim 1.5X Modifier Right',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useTokenApprove(chainId) {
  const c = getTokenContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(c, 'approve', {
    transactionName: 'Approve',
  });
  return {
    state,
    send,
    events,
    resetState,
  };
}

// these cg price hooks have been copied across from usedapp, as they're using
// an incompatible version of react with what's used in this app right now

// get price from token contract
export const getCoingeckoSimpleTokenPriceUri = (contract, quoteId, platformId) => `https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contract}&vs_currencies=${quoteId}`;

export const fetchCoingeckoTokenPrice = (fetchFunction) => async (contract, quote, platform) => {
  try {
    const addr = contract.toLowerCase();
    const quoteId = quote.toLowerCase();
    const platformId = platform.toLowerCase();
    const url = getCoingeckoSimpleTokenPriceUri(addr, quoteId, platformId);
    const data = await fetchFunction(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await data.json();
    const price = result[addr][quoteId];
    return price ? price + '' : undefined;
  } catch (_) {
    return undefined;
  }
};

export const getCoingeckoTokenPrice = fetchCoingeckoTokenPrice(
  typeof window !== 'undefined' && window.fetch,
);

export const getCoingeckoSimplePriceUri = (baseId, quoteId) => `https://api.coingecko.com/api/v3/simple/price?ids=${baseId}&vs_currencies=${quoteId}`;

export const fetchCoingeckoPrice = (fetchFunction) => async (base, quote) => {
  try {
    const baseId = base.toLowerCase();
    const quoteId = quote.toLowerCase();
    const url = getCoingeckoSimplePriceUri(baseId, quoteId);
    const data = await fetchFunction(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await data.json();
    const price = result[baseId][quoteId];
    return price ? price + '' : undefined;
  } catch (_) {
    return undefined;
  }
};

export const getCoingeckoPrice = fetchCoingeckoPrice(typeof window !== 'undefined' && window.fetch);

export const useCoingeckoPrice = (base, quote = 'usd') => {
  const [price, setPrice] = useState(undefined);
  const blockNo = useBlockNumber();

  useEffect(() => {
    async function getPrice() {
      const tokenPrice = await getCoingeckoPrice(base, quote);
      setPrice(tokenPrice);
    }

    getPrice();
  }, [base, quote, blockNo]);

  return price;
};

export const useCoingeckoTokenPrice = (contract, quote = 'usd', platform = 'ethereum') => {
  const [price, setPrice] = useState(undefined);
  const blockNo = useBlockNumber();

  useEffect(() => {
    async function getPrice() {
      const tokenPrice = await getCoingeckoTokenPrice(contract, quote, platform);
      setPrice(tokenPrice);
    }

    getPrice();
  }, [contract, quote, platform, blockNo]);

  return price;
};
