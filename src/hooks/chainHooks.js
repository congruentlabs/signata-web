/* eslint-disable prefer-template */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useContractFunction, useCall, useBlockNumber } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import {
  ID_CONTRACT_AVAX,
  ID_CONTRACT_BSC,
  ID_CONTRACT_FTM,
  ID_CONTRACT_MAINNET,
  ID_CONTRACT_METIS,
  ID_CONTRACT_RINKEBY,
  NANO_CONTRACT_AVAX,
  NANO_CONTRACT_BSC,
  NANO_CONTRACT_FTM,
  NANO_CONTRACT_MAINNET,
  NANO_CONTRACT_RINKEBY,
  NANO_CONTRACT_METIS,
  RIGHTS_CONTRACT_AVAX,
  RIGHTS_CONTRACT_BSC,
  RIGHTS_CONTRACT_FTM,
  RIGHTS_CONTRACT_MAINNET,
  RIGHTS_CONTRACT_METIS,
  RIGHTS_CONTRACT_RINKEBY,
  TOKEN_CONTRACT_AVAX,
  TOKEN_CONTRACT_BSC,
  TOKEN_CONTRACT_FTM,
  TOKEN_CONTRACT_MAINNET,
  TOKEN_CONTRACT_METIS,
  TOKEN_CONTRACT_RINKEBY,
  ID_CONTRACT_MATIC,
} from '../config';
import TOKEN_ABI from './sataAbi.json';
import NANO_ABI from './nanoAbi.json';
import ID_ABI from './identityAbi.json';
import RIGHTS_ABI from './rightsAbi.json';

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
    return RIGHTS_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return RIGHTS_CONTRACT_RINKEBY;
  }
  if (chainId === 56) {
    // bsc
    return RIGHTS_CONTRACT_BSC;
  }
  if (chainId === 250) {
    // fantom
    return RIGHTS_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return RIGHTS_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return RIGHTS_CONTRACT_AVAX;
  }
  return RIGHTS_CONTRACT_MAINNET;
};

export const getRightsContract = (chainId) => new Contract(getRightsContractAddress(chainId), RIGHTS_ABI);

export const getNanoContractAddress = (chainId) => {
  if (chainId === 1) {
    return NANO_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return NANO_CONTRACT_RINKEBY;
  }
  if (chainId === 56) {
    // bsc
    return NANO_CONTRACT_BSC;
  }
  if (chainId === 250) {
    // fantom
    return NANO_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return NANO_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return NANO_CONTRACT_AVAX;
  }
  return NANO_CONTRACT_MAINNET;
};

export const getNanoContract = (chainId) => new Contract(getNanoContractAddress(chainId), NANO_ABI);

export const getTokenContractAddress = (chainId) => {
  if (chainId === 1) {
    return TOKEN_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return TOKEN_CONTRACT_RINKEBY;
  }
  if (chainId === 56) {
    // bsc
    return TOKEN_CONTRACT_BSC;
  }
  if (chainId === 250) {
    // fantom
    return TOKEN_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return TOKEN_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return TOKEN_CONTRACT_AVAX;
  }
  return TOKEN_CONTRACT_MAINNET;
};

export const getTokenContract = (chainId) => new Contract(getTokenContractAddress(chainId), TOKEN_ABI);

export const getIdContractAddress = (chainId) => {
  if (chainId === 1) {
    return ID_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return ID_CONTRACT_RINKEBY;
  }
  if (chainId === 56) {
    // bsc
    return ID_CONTRACT_BSC;
  }
  if (chainId === 137) {
    // matic
    return ID_CONTRACT_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return ID_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return ID_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return ID_CONTRACT_AVAX;
  }
  return ID_CONTRACT_MAINNET;
};

export const getIdContract = (chainId) => new Contract(getIdContractAddress(chainId), ID_ABI);

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
  const identityContract = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'create',
    {
      transactionName: 'Create Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useDestroyIdentity(chainId) {
  const identityContract = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'destroy',
    {
      transactionName: 'Destroy Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useLockIdentity(chainId) {
  const identityContract = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'lock',
    {
      transactionName: 'Lock Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useUnlockIdentity(chainId) {
  const identityContract = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'unlock',
    {
      transactionName: 'Unlock Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useRolloverIdentity(chainId) {
  const identityContract = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'rollover',
    {
      transactionName: 'Rollover Signata Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useCreateNano(chainId) {
  const nanoContract = getNanoContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    nanoContract,
    'create',
    {
      transactionName: 'Create Nano Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useDelegateNano(chainId) {
  const nanoContract = getNanoContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    nanoContract,
    'setDelegate',
    {
      transactionName: 'Delegate Nano Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useLockNano(chainId) {
  const nanoContract = getNanoContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    nanoContract,
    'lock',
    {
      transactionName: 'Lock Nano Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useSelfLockNano(chainId) {
  const nanoContract = getNanoContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    nanoContract,
    'selfLock',
    {
      transactionName: 'Self Lock Nano Identity',
    },
  );
  return {
    state,
    send,
    events,
    resetState,
  };
}

export function useBuyCloud(chainId) {
  const identityContract = getIdContract(chainId);
  const {
    state, send, events, resetState,
  } = useContractFunction(
    identityContract,
    'buyCloud',
    {
      transactionName: 'Buy Cloud Subscription',
    },
  );
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
export const getCoingeckoSimpleTokenPriceUri = (
  contract,
  quoteId,
  platformId,
) => `https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contract}&vs_currencies=${quoteId}`;

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

export const getCoingeckoPrice = fetchCoingeckoPrice(
  typeof window !== 'undefined' && window.fetch,
);

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

export const useCoingeckoTokenPrice = (
  contract,
  quote = 'usd',
  platform = 'ethereum',
) => {
  const [price, setPrice] = useState(undefined);
  const blockNo = useBlockNumber();

  useEffect(() => {
    async function getPrice() {
      const tokenPrice = await getCoingeckoTokenPrice(
        contract,
        quote,
        platform,
      );
      setPrice(tokenPrice);
    }

    getPrice();
  }, [contract, quote, platform, blockNo]);

  return price;
};
